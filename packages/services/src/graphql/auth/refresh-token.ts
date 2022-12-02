import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import type { MutationRefreshTokenArgs, RefreshPayload } from '~/appsync.gen'
import { ErrorMessage, ErrorResponse } from '~/graphql/auth/support/error'
import { getClient } from '~/graphql/support/auth0'

const RefreshResponse = z.object({
  access_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
})

const auth0 = getClient()

export const refreshToken: AppSyncResolverHandler<
  MutationRefreshTokenArgs,
  RefreshPayload
> = async (event) => {
  try {
    const { refreshToken } = event.arguments

    const response = await auth0.refreshToken({
      refresh_token: refreshToken,
    })

    const tokens = RefreshResponse.parse(response)

    return {
      tokens: {
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        expiresIn: tokens.expires_in,
      },
    }
  } catch (error: unknown) {
    console.error(JSON.stringify(error))
    const errorResponse = ErrorResponse.parse(error)
    const message = JSON.parse(errorResponse.message)
    const errorMessage = ErrorMessage.parse(message)

    return {
      refreshError: errorMessage.error_description,
    }
  }
}
