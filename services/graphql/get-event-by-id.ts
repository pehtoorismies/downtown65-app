import { getTable } from '../functions/db/table'
import { getPrimaryKey } from '../functions/events/support/event-primary-key'
import { LegacyEvent } from './support/event'
import { toLegacyEvent } from './support/legacy-api'

export type EventArguments = {
  eventId: string
}

export const getEventById = async (
  input: EventArguments
): Promise<LegacyEvent | undefined> => {
  const Table = getTable()
  const result = await Table.Dt65Event.get(getPrimaryKey(input.eventId))

  return result.Item ? toLegacyEvent(result.Item) : undefined
}
