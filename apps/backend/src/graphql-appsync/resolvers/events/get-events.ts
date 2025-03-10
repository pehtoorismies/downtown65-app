import type { Event as Dt65Event } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { EmptyArgs } from '~/graphql-appsync/resolvers/empty-args'
import * as Event from '../../core/event'

export const getEvents: AppSyncResolverHandler<EmptyArgs, Dt65Event[]> = () => {
  return Event.getFutureEvents()
}
