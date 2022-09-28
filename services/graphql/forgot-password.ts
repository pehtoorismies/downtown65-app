import { AppSyncResolverHandler } from 'aws-lambda'

import { MutationForgotPasswordArgs } from '../appsync'

export const forgotPassword: AppSyncResolverHandler<
  MutationForgotPasswordArgs,
  boolean
> = async (event) => {
  console.log(event.arguments.email)

  return true
}
