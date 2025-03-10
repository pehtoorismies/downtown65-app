import type { MutationLeaveEventArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import type { Claims } from '~/graphql-appsync/resolvers/jwt-claims'
import * as Event from '../../core/event'

export const leaveEvent: AppSyncResolverHandler<
  MutationLeaveEventArgs,
  boolean | undefined
> = async (event) => {
  const eventId = event.arguments.eventId
  const identity = event.identity as AppSyncIdentityOIDC
  const claims = identity.claims as Claims

  await Event.leave(eventId, claims.sub)

  return true
}
