import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import type { LoginPayload, MutationLoginArgs } from '~/appsync.gen'
import { ErrorMessage, ErrorResponse } from '~/graphql/auth/support/error'
import { getClient } from '~/graphql/support/auth0'

const Auth0Response = z.object({
  access_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
})

const auth0 = getClient()

export const login: AppSyncResolverHandler<
  MutationLoginArgs,
  LoginPayload
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
      tokens: {
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        expiresIn: tokens.expires_in,
        refreshToken: tokens.refresh_token,
      },
    }
  } catch (error: unknown) {
    console.error(JSON.stringify(error))
    const errorResponse = ErrorResponse.parse(error)

    const message = JSON.parse(errorResponse.message)
    const errorMessage = ErrorMessage.parse(message)

    return {
      loginError: {
        message: errorMessage.error_description,
        path: 'input/email',
        code: errorMessage.error,
      },
    }
  }
}
