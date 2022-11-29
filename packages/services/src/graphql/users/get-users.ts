import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import type { UsersResponse, QueryUsersArgs } from '~/appsync.gen'
import { getAuth0Management } from '~/graphql/support/auth0'

const Auth0UserResponse = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
  nickname: z.string(),
  picture: z.string(),
})

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
  const users = auth0Users.map((auth0User) => {
    return {
      id: auth0User.user_id,
      email: auth0User.email,
      name: auth0User.name,
      nickname: auth0User.nickname,
      picture: auth0User.picture,
    }
  })

  return {
    ...response,
    users,
  }
}
