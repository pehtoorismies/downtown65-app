import type {
  Event as Dt65Event,
  QueryEventArgs as QueryEventArguments,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'

export const getEventById: AppSyncResolverHandler<
  QueryEventArguments,
  Dt65Event | null
> = (event) => {
  return Event.getById(event.arguments.eventId)
}
