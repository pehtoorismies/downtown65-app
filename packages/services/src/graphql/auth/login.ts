import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import type { LoginPayload, MutationLoginArgs } from '~/appsync.gen'
import { getClient } from '~/support/auth0'

const Auth0Response = z.object({
  access_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
})

const auth0 = getClient()

const ErrorResponse = z.object({
  name: z.string(),
  message: z.string(),
  statusCode: z.number(),
})

const ErrorMessage = z.object({
  error: z.string(),
  error_description: z.string(),
})

export const login: AppSyncResolverHandler<
  MutationLoginArgs,
  LoginPayload
> = async (event) => {
  try {
    const auth0Response = await auth0.passwordGrant({
      username: event.arguments.email,
      password: event.arguments.password,
      scope:
        'read:events write:events read:me write:me read:users openid profile',
      audience: Config.JWT_AUDIENCE,
    })

    const tokens = Auth0Response.parse(auth0Response)

    return {
      tokens: {
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        expiresIn: tokens.expires_in,
      },
    }
  } catch (error: unknown) {
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
