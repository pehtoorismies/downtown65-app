import type { AppSyncResolverHandler } from 'aws-lambda'
import { getClient } from '~/common/auth0-clients'
import type { MutationForgotPasswordArgs } from '~/generated-types/graphql-types'

const auth0 = getClient()

export const forgotPassword: AppSyncResolverHandler<
  MutationForgotPasswordArgs,
  boolean
> = async (event) => {
  try {
    await auth0.database.changePassword({
      email: event.arguments.email,
      connection: 'Username-Password-Authentication',
    })
  } catch (error) {
    console.error(error)
  }

  return true
}
