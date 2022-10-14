import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { MutationSignupArgs, User } from '../../appsync.gen'
import { getAuth0Management } from '../../support/auth0'
import { Auth0UserResponse, toUser } from '../support/auth0-user'

export const signup: AppSyncResolverHandler<MutationSignupArgs, User> = async (
  event
) => {
  const args = event.arguments

  if (args.registerSecret !== Config.REGISTER_SECRET) {
    throw new Error('Invalid register secret')
  }

  const user = {
    email: args.email,
    password: args.password,
    name: args.name,
    nickname: args.nickname,
  }

  const management = await getAuth0Management()
  const returnObject = await management.createUser({
    connection: 'Username-Password-Authentication',
    ...user,
    verify_email: true,
    email_verified: false,
    user_metadata: {
      subscribeWeeklyEmail: true,
      subscribeEventCreationEmail: true,
    },
    app_metadata: { role: 'USER' },
  })

  const auth0User = Auth0UserResponse.parse(returnObject)

  return toUser(auth0User)
}
