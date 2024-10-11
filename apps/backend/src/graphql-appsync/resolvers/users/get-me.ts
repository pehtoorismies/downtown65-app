import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { parseAuth0UserResponse, toUser } from './support/auth0-user'
import { getAuth0Management } from '~/common/auth0-clients'
import type { MeUser } from '~/generated-types/graphql-types'
import type { EmptyArgs } from '~/graphql-appsync/resolvers/empty-args'

export const getMe: AppSyncResolverHandler<EmptyArgs, MeUser> = async (
  event
) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const { data } = await management.users.get({ id: identity.sub })

  const auth0User = parseAuth0UserResponse(data)

  return toUser(auth0User)
}
