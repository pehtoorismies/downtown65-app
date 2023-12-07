import { logger } from '@downtown65-app/core/logger/logger'
import type { MutationAddChallengeAccomplishmentArgs } from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import * as Challenge from '../core/challenge'
import type { Claims } from '~/gql/jwt-claims'

export const addChallengeAccomplishment: AppSyncResolverHandler<
  MutationAddChallengeAccomplishmentArgs,
  boolean
> = async (event) => {
  const { id, me, date } = event.arguments
  const identity = event.identity as AppSyncIdentityOIDC
  const claims = identity.claims as Claims

  if (claims.sub !== me.id) {
    throw new Error(
      'Trying to insert somebody else. You can only add execution to yourself.'
    )
  }

  logger.warn('Some data', 'This is the logging warn message')
  console.error('Hey, console.error works')

  await Challenge.addAccomplishment({
    id,
    user: me,
    date,
  })

  return true
}
