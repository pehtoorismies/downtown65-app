import { logger } from '@downtown65-app/logger'
import { ISODate } from '@downtown65-app/time'
import type { MutationAddChallengeAccomplishmentArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import * as Challenge from '../../core/challenge'
import type { Claims } from '~/graphql-appsync/resolvers/jwt-claims'

export const addChallengeAccomplishment: AppSyncResolverHandler<
  MutationAddChallengeAccomplishmentArgs,
  boolean
> = async (event) => {
  const {
    input: { userId, id, date },
  } = event.arguments
  const identity = event.identity as AppSyncIdentityOIDC
  const claims = identity.claims as Claims

  if (claims.sub !== userId) {
    throw new Error(
      'Trying to insert somebody else. You can only add execution to yourself.'
    )
  }

  logger.warn('Some data', 'This is the logging warn message')

  await Challenge.addAccomplishment({
    id,
    userId,
    date: ISODate.parse(date),
  })

  return true
}
