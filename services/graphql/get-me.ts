import { AppSyncResolverHandler } from 'aws-lambda'
import { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { User } from '../appsync'
import { getAuth0Management } from '../functions/support/auth'

import { EmptyArgs } from './gql'
import { Auth0UserResponse, toUser } from './support/auth0-user'

// type Identity = {
//   identity: {
//     claims: {
//       sub: string
//       aud: string[]
//       azp: string
//       scope: string
//       iss: string
//       ['https://graphql.downtown65.com/nickname']: string
//       exp: number
//       iat: number
//       gty: string
//     }
//     issuer: string
//     sub: string
//   }
// }

export const getMe: AppSyncResolverHandler<EmptyArgs, User> = async (event) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const response = await management.getUser({ id: identity.sub })
  const auth0User = Auth0UserResponse.parse(response)
  return toUser(auth0User)
}
