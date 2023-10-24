import type {
  QueryUsersArgs,
  UsersResponse,
} from '@downtown65-app/graphql/graphql'
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
  const { data } = await management.users.getAll({
    page: page,
    per_page: perPage,
    include_totals: true,
    fields: QUERY_USER_RETURNED_FIELDS,
    sort: 'created_at:1',
  })

  const auth0Users = Auth0Users.parse(data.users)
  const users = auth0Users.map((u) => mapToOtherUser(u))

  return {
    ...data,
    users,
    __typename: 'UsersResponse',
  }
}
