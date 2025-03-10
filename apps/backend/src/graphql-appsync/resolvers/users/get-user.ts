import type { OtherUser, QueryUserArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { getAuth0Management } from '~/common/auth0-clients'
import {
  QUERY_USER_RETURNED_FIELDS,
  mapToOtherUser,
} from './support/auth0-user'

export const getUser: AppSyncResolverHandler<
  QueryUserArgs,
  OtherUser | undefined
> = async (event) => {
  const { nickname } = event.arguments
  const management = await getAuth0Management()

  // GetUsers200ResponseOneOfInner

  const { data } = await management.users.getAll({
    q: `nickname:${nickname}`,
    fields: QUERY_USER_RETURNED_FIELDS,
    sort: 'created_at:1',
  })

  return data.length === 0 ? undefined : mapToOtherUser(data[0])
}
