import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../../core/event'
import type { Event as Dt65Event } from '~/generated-types/graphql-types'
import type { EmptyArgs } from '~/graphql-appsync/resolvers/empty-args'

export const getEvents: AppSyncResolverHandler<EmptyArgs, Dt65Event[]> = () => {
  return Event.getFutureEvents()
}
