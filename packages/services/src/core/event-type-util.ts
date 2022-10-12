import { EventType } from '../../appsync'

export const getEventValues = () => Object.values(EventType)

export const isEventType = (eventType: string): eventType is EventType => {
  return getEventValues().includes(eventType as EventType)
}
