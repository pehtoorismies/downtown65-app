import type { AppSyncResolverHandler } from 'aws-lambda'
import type {
  Event as Dt65Event,
  MutationCreateEventArgs,
} from '../../../appsync'
import * as Event from '../../core/event'
import { EVENT_TYPES, isEventType } from '../../core/event-type'

export const createEvent: AppSyncResolverHandler<
  MutationCreateEventArgs,
  Dt65Event
> = async (event) => {
  const { event: creatableEvent } = event.arguments

  if (!isEventType(creatableEvent.type)) {
    throw new Error(
      `Schema mismatch. 'type' is not within ${EVENT_TYPES.join(',')} `
    )
  }

  return Event.create({
    ...creatableEvent,
    race: creatableEvent.race ?? false,
    subtitle: creatableEvent.subtitle ?? undefined,
    type: creatableEvent.type,
  })
}
