import type { AppSyncResolverHandler } from 'aws-lambda'
import type { MutationForgotPasswordArgs } from '~/appsync.gen'
import { getClient } from '~/support/auth0'

const auth0 = getClient()

export const forgotPassword: AppSyncResolverHandler<
  MutationForgotPasswordArgs,
  boolean
> = async (event) => {
  try {
    await auth0.requestChangePasswordEmail({
      email: event.arguments.email,
      connection: 'Username-Password-Authentication',
    })
  } catch (error) {
    console.error(error)
  }

  return true
}
