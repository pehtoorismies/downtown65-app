import type { MutationParticipateChallengeArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import * as Challenge from '../core/challenge'
import type { Claims } from '~/gql/jwt-claims'

export const participateChallenge: AppSyncResolverHandler<
  MutationParticipateChallengeArgs,
  boolean
> = async (event) => {
  const { id, me } = event.arguments
  const identity = event.identity as AppSyncIdentityOIDC
  const claims = identity.claims as Claims

  if (claims.sub !== me.id) {
    throw new Error(
      'Trying to insert somebody else. You can only participate yourself.'
    )
  }

  await Challenge.participate(id, me)
  return true
}
