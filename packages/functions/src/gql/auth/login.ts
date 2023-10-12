import type {
  LoginResponse,
  MutationLoginArgs,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { Config } from 'sst/node/config'
import { z } from 'zod'
import { ErrorMessage, ErrorResponse } from '~/gql/auth/support/error'
import { getClient } from '~/gql/support/auth0'

const Auth0Response = z.object({
  access_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
})

const auth0 = getClient()

export const login: AppSyncResolverHandler<
  MutationLoginArgs,
  LoginResponse
> = async (event) => {
  try {
    const auth0Response = await auth0.passwordGrant({
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
    const tokens = Auth0Response.parse(auth0Response)

    return {
      __typename: 'Tokens',
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      expiresIn: tokens.expires_in,
      refreshToken: tokens.refresh_token,
    }
  } catch (error: unknown) {
    // TODO: use logger
    console.error(JSON.stringify(error))
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
