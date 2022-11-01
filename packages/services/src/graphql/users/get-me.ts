import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import type { MeUser } from '~/appsync.gen'
import { Auth0UserResponse, toUser } from '~/graphql/support/auth0-user'
import type { EmptyArgs } from '~/graphql/support/empty-args'
import { getAuth0Management } from '~/support/auth0'

export const getMe: AppSyncResolverHandler<EmptyArgs, MeUser> = async (
  event
) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const response = await management.getUser({ id: identity.sub })
  const auth0User = Auth0UserResponse.parse(response)
  return toUser(auth0User)
}
