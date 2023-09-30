import type { Event as Dt65Event } from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'
import type { EmptyArgs } from '~/gql/support/empty-args'

export const getEvents: AppSyncResolverHandler<
  EmptyArgs,
  Dt65Event[]
> = async () => {
  return Event.getFutureEvents()
}
