import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../../core/event'
import type {
  IdPayload,
  MutationDeleteEventArgs,
} from '~/generated-types/graphql-types'

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
