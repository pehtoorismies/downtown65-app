import type { AppSyncResolverHandler } from 'aws-lambda'
import { EventType } from '~/appsync.gen'
import type { Event as Dt65Event, MutationCreateEventArgs } from '~/appsync.gen'
import * as Event from '~/core/event'
import { mapDynamoToEvent } from '~/core/map-dynamo-to-event'

const getEventValues = () => Object.values(EventType)

const isEventType = (eventType: string): eventType is EventType => {
  return getEventValues().includes(eventType as EventType)
}

export const createEvent: AppSyncResolverHandler<
  MutationCreateEventArgs,
  Dt65Event
> = async (event) => {
  const { event: creatableEvent } = event.arguments

  if (!isEventType(creatableEvent.type)) {
    throw new Error(
      `Schema mismatch. 'type' is not within ${getEventValues().join(',')} `
    )
  }

  return mapDynamoToEvent(
    Event.create({
      ...creatableEvent,
      race: creatableEvent.race ?? false,
      type: creatableEvent.type,
    })
  )
}
