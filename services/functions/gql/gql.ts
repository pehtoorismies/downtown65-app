import { getEventById } from './get-event-by-id'

type AppSyncEvent = {
  info: {
    fieldName: string
  }
  arguments: {
    eventId: string
  }
}

export type Event = {
  id: string
  title: string
}

export const main = (event: AppSyncEvent): Promise<Event | undefined> => {
  switch (event.info.fieldName) {
    case 'getEventById': {
      console.log(event.arguments.eventId)
      return getEventById(event.arguments.eventId)
    }
    default:
      return Promise.resolve(void 0)
  }
}
