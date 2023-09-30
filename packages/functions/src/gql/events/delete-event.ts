import type {
  IdPayload,
  MutationDeleteEventArgs,
} from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'

export const deleteEvent: AppSyncResolverHandler<
  MutationDeleteEventArgs,
  IdPayload
> = async (event) => {
  await Event.remove(event.arguments.eventId)

  return {
    id: event.arguments.eventId,
  }
}
