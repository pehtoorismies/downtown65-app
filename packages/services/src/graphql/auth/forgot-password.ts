import type { AppSyncResolverHandler } from 'aws-lambda'
import type { MutationForgotPasswordArgs } from '~/appsync.gen'

export const forgotPassword: AppSyncResolverHandler<
  MutationForgotPasswordArgs,
  boolean
> = async (event) => {
  if (!event.arguments.email) {
    console.error('TODO')
  }

  return true
}
