import type { MutationParticipateEventArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import type { Claims } from '~/graphql-appsync/resolvers/jwt-claims'
import * as Event from '../../core/event'

export const participateEvent: AppSyncResolverHandler<
  MutationParticipateEventArgs,
  boolean | undefined
> = async (event) => {
  const { eventId, me } = event.arguments
  const identity = event.identity as AppSyncIdentityOIDC
  const claims = identity.claims as Claims

  if (claims.sub !== me.id) {
    throw new Error(
      'Trying to insert somebody else. You can only participate yourself.',
    )
  }

  await Event.participate(eventId, me)
  return true
}
