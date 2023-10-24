import type { MeUser } from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { getAuth0Management } from '~/gql/support/auth0'
import { parseAuth0UserResponse, toUser } from '~/gql/support/auth0-user'
import type { EmptyArgs } from '~/gql/support/empty-args'

export const getMe: AppSyncResolverHandler<EmptyArgs, MeUser> = async (
  event
) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const { data } = await management.users.get({ id: identity.sub })

  const auth0User = parseAuth0UserResponse(data)

  return toUser(auth0User)
}
