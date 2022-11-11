import type { AppSyncResolverHandler } from 'aws-lambda'
import { EventType } from '~/appsync.gen'
import type { MutationCreateEventArgs, IdPayload } from '~/appsync.gen'
import * as Event from '~/core/event'

const getEventValues = () => Object.values(EventType)

const isEventType = (eventType: string): eventType is EventType => {
  return getEventValues().includes(eventType as EventType)
}

export const createEvent: AppSyncResolverHandler<
  MutationCreateEventArgs,
  IdPayload
> = async (event) => {
  const { input: creatableEvent } = event.arguments

  if (!isEventType(creatableEvent.type)) {
    throw new Error(
      `Schema mismatch. 'type' is not within ${getEventValues().join(',')} `
    )
  }
  const { id } = await Event.create({
    ...creatableEvent,
    type: creatableEvent.type,
  })

  return {
    id,
  }
}
