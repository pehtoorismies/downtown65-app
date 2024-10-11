import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../../core/event'
import type {
  Event as Dt65Event,
  QueryEventArgs as QueryEventArguments,
} from '~/generated-types/graphql-types'

export const getEventById: AppSyncResolverHandler<
  QueryEventArguments,
  Dt65Event | null
> = (event) => {
  return Event.getById(event.arguments.eventId)
}
