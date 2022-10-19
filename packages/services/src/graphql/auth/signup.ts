import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as EmailValidator from 'email-validator'
import { Auth0UserResponse, toUser } from '../support/auth0-user'
import type {
  FieldError,
  MutationSignupArgs,
  SignupPayload,
} from '~/appsync.gen'
import { getAuth0Management } from '~/support/auth0'

export const signup: AppSyncResolverHandler<
  MutationSignupArgs,
  SignupPayload
> = async (event) => {
  const { input } = event.arguments

  const errors: FieldError[] = []

  if (input.registerSecret !== Config.REGISTER_SECRET) {
    errors.push({
      message: 'Wrong register secret',
      path: 'registerSecret',
    })
  }
  if (input.password.length < 8) {
    errors.push({
      message: 'Password too short',
      path: 'password',
    })
  }
  if (!EmailValidator.validate(input.email)) {
    errors.push({
      message: 'Email format is incorrect',
      path: 'email',
    })
  }

  if (errors.length > 0) {
    return { errors }
  }

  const user = {
    email: input.email,
    password: input.password,
    name: input.name,
    nickname: input.nickname,
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

  return { user: toUser(auth0User) }
}
