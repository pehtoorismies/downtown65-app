import formatISO from 'date-fns/formatISO'
import { v4 as uuidv4 } from 'uuid'
import type { MutationCreateEventArgs } from '../appsync'
import { getTable } from '../dynamo/table'
import { getPrimaryKey } from '../graphql/events/support/event-primary-key'
import type { EventType } from '../graphql/events/support/event-type'

const Table = getTable()

export const create = async (input: MutationCreateEventArgs['event']) => {
  const { title, dateStart, type, subtitle, race } = input
  const eventId = uuidv4()
  const startDate = formatISO(new Date(dateStart))

  await Table.Dt65Event.put(
    {
      // add keys
      ...getPrimaryKey(eventId),
      GSI1PK: `EVENT#FUTURE`,
      GSI1SK: `DATE#${startDate}#${eventId.slice(0, 8)}`,
      // add props
      createdBy: 'add later',
      dateStart: startDate,
      id: eventId,
      title,
      subtitle,
      race: race ?? false,
      participants: {},
      type,
    },
    { returnValues: 'none' }
  )
  return {
    id: eventId,
    title,
    subtitle: subtitle ?? undefined,
    race: race ?? false,
    type: type as EventType,
    dateStart: startDate,
  }
}
