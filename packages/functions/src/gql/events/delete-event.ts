import type {
  IdPayload,
  MutationDeleteEventArgs,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'

export const deleteEvent: AppSyncResolverHandler<
  MutationDeleteEventArgs,
  IdPayload
> = async (event) => {
  await Event.remove(event.arguments.eventId)

  return {
    __typename: 'IDPayload',
    id: event.arguments.eventId,
  }
}
