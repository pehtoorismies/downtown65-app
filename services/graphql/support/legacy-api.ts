import type { Event as LegacyEvent } from '../../appsync'
import type { Event } from './event'

export const toLegacyEvent = (event: Event): LegacyEvent => {
  return {
    ...event,
    exactTime: !!event.id,
  }
}
