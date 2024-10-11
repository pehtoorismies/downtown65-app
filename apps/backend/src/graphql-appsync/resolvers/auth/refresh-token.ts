import { logger } from '@downtown65-app/logger/logger'
import type { TokenSet } from 'auth0'
import { AuthApiError } from 'auth0'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import { getClient } from '~/common/auth0-clients'
import type {
  MutationRefreshTokenArgs,
  RefreshResponse,
} from '~/generated-types/graphql-types'

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
    if (error instanceof AuthApiError) {
      logger.debug(error, 'Refresh Error')

      return {
        __typename: 'RefreshError',
        message: error.message,
        statusCode: error.statusCode,
        error: error.error,
      }
    }

    logger.error(error, 'Unexpected refresh token error')

    return {
      __typename: 'RefreshError',
      message: 'Unexpected error. Contact admin.',
      statusCode: 500,
      error: 'unexpected_error',
    }
  }
}
