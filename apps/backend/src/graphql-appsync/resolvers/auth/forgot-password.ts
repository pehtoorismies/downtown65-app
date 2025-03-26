import { logger } from '@downtown65-app/logger'
import type { MutationForgotPasswordArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import { getClient } from '~/common/auth0-clients'

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
    logger.info(error, 'Unable to change password')
  }

  return true
}
