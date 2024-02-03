import { logger } from '@downtown65-app/logger'
import type { LoginResponse, MutationLoginArgs } from '@downtown65-app/types'
import type { TokenSet } from 'auth0'
import { AuthApiError } from 'auth0'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { Config } from 'sst/node/config'
import { z } from 'zod'
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

const auth0ManagementClient = getClient()

export const login: AppSyncResolverHandler<
  MutationLoginArgs,
  LoginResponse
> = async (event) => {
  try {
    const { data } = await auth0ManagementClient.oauth.passwordGrant({
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
    if (error instanceof AuthApiError) {
      if (error.error !== 'invalid_grant') {
        logger.info(error, 'Login error')
      }

      return {
        __typename: 'LoginError',
        error: error.error,
        statusCode: error.statusCode,
        message: error.message,
      }
    }

    logger.error(error, 'Unexpected login error')

    return {
      __typename: 'LoginError',
      message: 'Unexpected error. Contact admin.',
      error: 'unexpected_error',
      statusCode: 500,
    }
  }
}
