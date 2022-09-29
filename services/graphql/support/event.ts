import { EventType } from '../../functions/support/event-type'

export interface Event {
  id: string
  title: string
  type: EventType
  subtitle?: string
  race: boolean
}
