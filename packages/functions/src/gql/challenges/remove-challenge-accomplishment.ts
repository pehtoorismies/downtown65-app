import { ISODate } from '@downtown65-app/core/event-time'
import type { MutationRemoveChallengeAccomplishmentArgs } from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import * as Challenge from '../core/challenge'
import type { Claims } from '~/gql/jwt-claims'

export const removeChallengeAccomplishment: AppSyncResolverHandler<
  MutationRemoveChallengeAccomplishmentArgs,
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

  await Challenge.removeAccomplishment({
    id,
    userId,
    date: ISODate.parse(date),
  })

  return true
}
