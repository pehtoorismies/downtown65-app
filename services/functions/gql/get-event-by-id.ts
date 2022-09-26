import { getTable } from '../db/table'
import { getPrimaryKey } from '../events/support/event-primary-key'
import { Event } from './gql'

export const getEventById = async (
  eventId: string
): Promise<Event | undefined> => {
  const Table = getTable()
  const result = await Table.Dt65Event.get(getPrimaryKey(eventId))
  return result.Item ? (result.Item as Event) : undefined
}
