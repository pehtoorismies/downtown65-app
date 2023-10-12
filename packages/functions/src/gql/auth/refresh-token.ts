import { RefreshResponse } from '@downtown65-app/graphql/graphql'
import type { MutationRefreshTokenArgs } from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import { ErrorMessage, ErrorResponse } from '~/gql/auth/support/error'
import { getClient } from '~/gql/support/auth0'

const RefreshResponse = z.object({
  access_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
})

const auth0 = getClient()

export const refreshToken: AppSyncResolverHandler<
  MutationRefreshTokenArgs,
  RefreshResponse
> = async (event) => {
  try {
    const { refreshToken } = event.arguments

    const response = await auth0.refreshToken({
      refresh_token: refreshToken,
    })

    const tokens = RefreshResponse.parse(response)

    return {
      __typename: 'RefreshTokens',
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      expiresIn: tokens.expires_in,
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
