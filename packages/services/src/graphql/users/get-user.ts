import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import { Auth0UserResponse, mapToOtherUser } from './auth0-user-response'
import type { OtherUser, QueryUserArgs } from '~/appsync.gen'
import { getAuth0Management } from '~/graphql/support/auth0'

const Auth0Users = z.array(Auth0UserResponse)

export const getUser: AppSyncResolverHandler<
  QueryUserArgs,
  OtherUser | undefined
> = async (event) => {
  const { nickname } = event.arguments
  const management = await getAuth0Management()

  const response = await management.getUsers({
    q: `nickname:${nickname}`,
    fields: 'nickname,name,user_id,picture,email',
    sort: 'created_at:1',
  })
  const auth0Users = Auth0Users.parse(response)

  return auth0Users.length === 0 ? undefined : mapToOtherUser(auth0Users[0])
}
