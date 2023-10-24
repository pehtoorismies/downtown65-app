import type { MutationForgotPasswordArgs } from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { getClient } from '~/gql/support/auth0'

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
