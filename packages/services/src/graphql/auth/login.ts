import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import type { AuthPayload, MutationLoginArgs } from '../../../appsync'
import { getClient } from '../../support/auth0'

const Auth0Response = z.object({
  access_token: z.string(),
  id_token: z.string(),
  expires_in: z.number(),
})

const auth0 = getClient()

export const login: AppSyncResolverHandler<
  MutationLoginArgs,
  AuthPayload
> = async (event) => {
  const auth0Response = await auth0.passwordGrant({
    username: event.arguments.email,
    password: event.arguments.password,
    scope:
      'read:events write:events read:me write:me read:users openid profile',
    audience: Config.JWT_AUDIENCE,
  })

  const tokens = Auth0Response.parse(auth0Response)

  return {
    accessToken: tokens.access_token,
    idToken: tokens.id_token,
    expiresIn: tokens.expires_in,
  }
}
