import type {
  Event as Dt65Event,
  QueryEventArgs as QueryEventArguments,
} from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'

export const getEventById: AppSyncResolverHandler<
  QueryEventArguments,
  Dt65Event | undefined
> = async (event) => {
  return Event.getById(event.arguments.eventId)
}
