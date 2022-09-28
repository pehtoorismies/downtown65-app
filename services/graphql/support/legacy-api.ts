import { Event as LegacyEvent } from '../../appsync'
import { Event } from './event'

export const toLegacyEvent = (event: Event): LegacyEvent => {
  return {
    ...event,
    exactTime: !!event.id,
  }
}
