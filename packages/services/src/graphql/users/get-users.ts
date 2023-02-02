import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import { Auth0UserResponse, mapToOtherUser } from './auth0-user-response'
import type { QueryUsersArgs, UsersResponse } from '~/appsync.gen'
import { getAuth0Management } from '~/graphql/support/auth0'

const Auth0Users = z.array(Auth0UserResponse)

export const getUsers: AppSyncResolverHandler<
  QueryUsersArgs,
  UsersResponse
> = async (event) => {
  const { page, perPage } = event.arguments
  const management = await getAuth0Management()
  const response = await management.getUsers({
    page: page,
    per_page: perPage,
    include_totals: true,
    fields: 'nickname,name,user_id,picture,email',
    sort: 'created_at:1',
  })
  const auth0Users = Auth0Users.parse(response.users)
  const users = auth0Users.map((u) => mapToOtherUser(u))

  return {
    ...response,
    users,
  }
}
