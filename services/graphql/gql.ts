import { createEvent, CreateEventArguments } from './create-event'
import { EventArguments, getEventById } from './get-event-by-id'
import { getEvents } from './get-events'
import { LegacyEvent } from './support/event'

type FieldName =
  | 'event'
  | 'events'
  | 'createEvent'
  | 'findEvent'
  | 'findManyEvents'

type Arguments = EventArguments & CreateEventArguments

interface AppSyncEvent {
  info: {
    fieldName: FieldName
  }
  arguments: Arguments
}

function assertUnreachable(x: never): never {
  throw new Error(`Didn't expect to get here ${x}`)
}

export const main = (
  event: AppSyncEvent
): Promise<LegacyEvent | LegacyEvent[] | undefined> => {
  console.log('INPUT', event.info.fieldName)

  switch (event.info.fieldName) {
    case 'findEvent': // Legacy query
    case 'event': {
      return getEventById(event.arguments as EventArguments)
    }
    case 'findManyEvents':
    case 'events': {
      // add some filter
      return getEvents()
    }
    case 'createEvent': {
      return createEvent(event.arguments as CreateEventArguments)
    }
  }
  return assertUnreachable(event.info.fieldName)
}
