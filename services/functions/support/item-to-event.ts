import { Dt65Event } from './dt65-event'
import { DynamoDt65EventItem } from './dynamo-event-item'

export const itemToEvent = (item: DynamoDt65EventItem): Dt65Event => {
  return {
    id: item.eventId,
    createdAt: item.createdAt,
    createdBy: item.createdBy,
    dateStart: item.dateStart,
    title: item.title,
  }
}
