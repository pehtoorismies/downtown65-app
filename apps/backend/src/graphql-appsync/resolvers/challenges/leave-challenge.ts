import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import * as Challenge from '../../core/challenge'
import type { MutationLeaveChallengeArgs } from '~/generated-types/graphql-types'
import type { Claims } from '~/graphql-appsync/resolvers/jwt-claims'

// TODO: duplicate of Event
export const leaveChallenge: AppSyncResolverHandler<
  MutationLeaveChallengeArgs,
  boolean
> = async (event) => {
  const challengeId = event.arguments.id
  const identity = event.identity as AppSyncIdentityOIDC
  const claims = identity.claims as Claims

  await Challenge.leave(challengeId, claims.sub)

  return true
}
