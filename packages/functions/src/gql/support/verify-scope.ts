import type {
  AppSyncIdentity,
  AppSyncIdentityOIDC,
} from 'aws-lambda/trigger/appsync-resolver'
import type { AllowedScope } from './match-scopes'
import { matchScopes } from './match-scopes'

interface Dt65Identity extends AppSyncIdentityOIDC {
  claims: {
    sub: string
    aud: string[]
    azp: string
    scope: string
    iss: string
    ['https://graphql.downtown65.com/nickname']: string
    exp: number
    iat: number
    gty: string
  }
}

export const verifyScope =
  (identity: AppSyncIdentity | undefined | null) =>
  (allowedScopes: AllowedScope[]) => {
    if (!identity) {
      throw new Error('No OpenIDConnect identity provide. JWT token missing.')
    }
    const { claims } = identity as Dt65Identity
    if (!matchScopes(allowedScopes)(claims.scope)) {
      throw new Error(
        `Unauthorized request not enough scope. Needs: ${allowedScopes.join(
          ','
        )}`
      )
    }
  }
