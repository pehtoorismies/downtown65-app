import type { AppSyncResolverHandler } from 'aws-lambda'
import type {
  Event as Dt65Event,
  QueryEventArgs as QueryEventArguments,
} from '~/appsync.gen'
import * as Event from '~/core/event'

export const getEventById: AppSyncResolverHandler<
  QueryEventArguments,
  Dt65Event | undefined
> = async (event) => {
  return Event.getById(event.arguments.eventId)
}
