import { LegacyEvent, Event } from './event'

export const toLegacyEvent = (event: Event): LegacyEvent => {
  return {
    ...event,
    exactTime: !!event.id,
  }
}
