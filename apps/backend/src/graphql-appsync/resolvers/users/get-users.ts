import type { AppSyncResolverHandler } from 'aws-lambda'
import {
  QUERY_USER_RETURNED_FIELDS,
  mapToOtherUser,
} from './support/auth0-user'
import { getAuth0Management } from '~/common/auth0-clients'
import type {
  QueryUsersArgs,
  UsersResponse,
} from '~/generated-types/graphql-types'

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

  // const auth0Users = Auth0Users.parse(data.users)
  const users = data.users.map((u) => mapToOtherUser(u))

  return {
    ...data,
    users,
    __typename: 'UsersResponse',
  }
}
