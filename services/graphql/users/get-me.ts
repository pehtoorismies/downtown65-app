import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import type { User } from '../../appsync'
import { getAuth0Management } from '../../functions/support/auth'

import type { EmptyArgs } from '../gql'
import { Auth0UserResponse, toUser } from '../support/auth0-user'

export const getMe: AppSyncResolverHandler<EmptyArgs, User> = async (event) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const response = await management.getUser({ id: identity.sub })
  const auth0User = Auth0UserResponse.parse(response)
  return toUser(auth0User)
}
