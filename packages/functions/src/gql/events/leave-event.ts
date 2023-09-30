import type { MutationLeaveEventArgs } from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import * as Event from '../core/event'

type Claims = {
  sub: string
  aud: string[]
  azp: string
  scope: string
  iss: string
  ['https://graphql.downtown65.com/nickname']: string
  exp: number
  iat: number
  gty: string
}

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
