import type {
  MutationRefreshTokenArgs,
  RefreshResponse,
} from '@downtown65-app/graphql/graphql'
import type { TokenSet } from 'auth0'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import { ErrorMessage, ErrorResponse } from '~/gql/auth/support/error'
import { getClient } from '~/gql/support/auth0'

const parseResponse = (tokenSet: TokenSet) => {
  return z
    .object({
      access_token: z.string(),
      id_token: z.string(),
      expires_in: z.number(),
    })
    .transform((tokens) => {
      return {
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        expiresIn: tokens.expires_in,
      }
    })
    .parse(tokenSet)
}

const auth0 = getClient()

export const refreshToken: AppSyncResolverHandler<
  MutationRefreshTokenArgs,
  RefreshResponse
> = async (event) => {
  try {
    const { refreshToken } = event.arguments

    const { data } = await auth0.oauth.refreshTokenGrant({
      refresh_token: refreshToken,
    })

    return {
      __typename: 'RefreshTokens',
      ...parseResponse(data),
    }
  } catch (error: unknown) {
    console.error(JSON.stringify(error))
    const errorResponse = ErrorResponse.parse(error)
    const message = JSON.parse(errorResponse.message)
    const errorMessage = ErrorMessage.parse(message)

    return {
      __typename: 'RefreshError',
      message: errorMessage.error_description,
    }
  }
}
