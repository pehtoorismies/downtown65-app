import type { MeUser } from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { getAuth0Management } from '~/gql/support/auth0'
import { Auth0UserResponse, toUser } from '~/gql/support/auth0-user'
import type { EmptyArgs } from '~/gql/support/empty-args'

export const getMe: AppSyncResolverHandler<EmptyArgs, MeUser> = async (
  event
) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const response = await management.getUser({ id: identity.sub })
  const auth0User = Auth0UserResponse.parse(response)
  return toUser(auth0User)
}
