import { logger } from '@downtown65-app/core/logger/logger'
import type {
  LoginResponse,
  MutationLoginArgs,
} from '@downtown65-app/graphql/graphql'
import type { TokenSet } from 'auth0'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { Config } from 'sst/node/config'
import { z } from 'zod'
import { ErrorMessage, ErrorResponse } from '~/gql/auth/support/error'
import { getClient } from '~/gql/support/auth0'

const parseResponse = (tokenSet: TokenSet) => {
  return z
    .object({
      access_token: z.string(),
      id_token: z.string(),
      expires_in: z.number(),
      refresh_token: z.string(),
    })
    .transform((tokens) => {
      return {
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        expiresIn: tokens.expires_in,
        refreshToken: tokens.refresh_token,
      }
    })
    .parse(tokenSet)
}

const auth0 = getClient()

export const login: AppSyncResolverHandler<
  MutationLoginArgs,
  LoginResponse
> = async (event) => {
  try {
    const { data } = await auth0.oauth.passwordGrant({
      username: event.arguments.email,
      password: event.arguments.password,
      // Scope explanation:
      // openid => get user profile
      // email => add email to user profile
      // offline_access => get a refresh token (enable in API settings)
      // read:events etc. are custom scopes defined in Auth0
      scope:
        'read:events write:events read:me write:me read:users openid profile email offline_access',
      audience: Config.JWT_AUDIENCE,
    })
    return {
      __typename: 'Tokens',
      ...parseResponse(data),
    }
  } catch (error: unknown) {
    logger.error(error, 'Unexpected login error')
    const errorResponse = ErrorResponse.parse(error)

    const message = JSON.parse(errorResponse.message)
    const errorMessage = ErrorMessage.parse(message)

    return {
      __typename: 'LoginError',
      message: errorMessage.error_description,
      path: 'input/email',
      code: errorMessage.error,
    }
  }
}
