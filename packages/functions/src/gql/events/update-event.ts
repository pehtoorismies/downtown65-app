import { ISODate, ISOTime } from '@downtown65-app/core/time-functions'
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

  const result = await Event.update(eventId, {
    ...input,
    dateStart: ISODate.parse(input.dateStart),
    timeStart: input.timeStart ? ISOTime.parse(input.timeStart) : undefined,
  })

  return result
}
