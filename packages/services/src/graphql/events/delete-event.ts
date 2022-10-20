import type { AppSyncResolverHandler } from 'aws-lambda'
import type { IdPayload, MutationDeleteEventArgs } from '~/appsync.gen'
import * as Event from '~/core/event'

export const deleteEvent: AppSyncResolverHandler<
  MutationDeleteEventArgs,
  IdPayload
> = async (event) => {
  await Event.remove(event.arguments.eventId)

  return {
    id: event.arguments.eventId,
  }
}
