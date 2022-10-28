import type { AppSyncResolverHandler } from 'aws-lambda'
import type { Event as Dt65Event } from '../../appsync.gen'
import * as Event from '~/core/event'
import type { EmptyArgs } from '~/graphql/support/empty-args'

export const getEvents: AppSyncResolverHandler<
  EmptyArgs,
  Dt65Event[]
> = async () => {
  return Event.getFutureEvents()
}
