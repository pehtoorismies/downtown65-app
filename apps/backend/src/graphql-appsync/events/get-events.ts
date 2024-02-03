import type { Event as Dt65Event } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'
import type { EmptyArgs } from '~/graphql-appsync/support/empty-args'

export const getEvents: AppSyncResolverHandler<EmptyArgs, Dt65Event[]> = () => {
  return Event.getFutureEvents()
}
