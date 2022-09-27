import { EventType } from '../functions/support/event-type'
import { getEventById } from './get-event-by-id'
import { getEvents } from './get-events'
import { LegacyEvent } from './support/event'

type AppSyncEvent = {
  info: {
    fieldName: string
  }
  arguments: {
    eventId: string
  }
}

export const main = (
  event: AppSyncEvent
): Promise<LegacyEvent | LegacyEvent[] | undefined> => {
  switch (event.info.fieldName) {
    case 'event': {
      return getEventById(event.arguments.eventId)
    }
    case 'events': {
      // add some filter
      return getEvents()
    }
    // Legacy
    case 'findEvent': {
      return getEventById(event.arguments.eventId)
    }
    case 'findManyEvents': {
      return getEvents()
    }
    default:
      return Promise.resolve(void 0)
  }
}
