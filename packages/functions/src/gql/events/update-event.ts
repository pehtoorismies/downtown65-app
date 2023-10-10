import type {
  Event as Dt65Event,
  MutationUpdateEventArgs,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'

export const updateEvent: AppSyncResolverHandler<
  MutationUpdateEventArgs,
  Dt65Event
> = async (event) => {
  const { input, eventId } = event.arguments
  const result = await Event.update(eventId, input)

  return result
}
