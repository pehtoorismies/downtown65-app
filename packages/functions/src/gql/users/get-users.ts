import type {
  QueryUsersArgs,
  UsersResponse,
} from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import { getAuth0Management } from '~/gql/support/auth0'
import {
  Auth0QueryUsersResponse,
  QUERY_USER_RETURNED_FIELDS,
  mapToOtherUser,
} from '~/gql/support/auth0-user'

const Auth0Users = z.array(Auth0QueryUsersResponse)

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
    fields: QUERY_USER_RETURNED_FIELDS,
    sort: 'created_at:1',
  })
  const auth0Users = Auth0Users.parse(response.users)
  const users = auth0Users.map((u) => mapToOtherUser(u))

  return {
    ...response,
    users,
  }
}
