import { getTable } from '../functions/db/table'
import { getPrimaryKey } from '../functions/events/support/event-primary-key'
import { LegacyEvent } from './support/event'
import { toLegacyEvent } from './support/legacy-api'

export const getEventById = async (
  eventId: string
): Promise<LegacyEvent | undefined> => {
  const Table = getTable()
  const result = await Table.Dt65Event.get(getPrimaryKey(eventId))

  return result.Item ? toLegacyEvent(result.Item) : undefined
}
