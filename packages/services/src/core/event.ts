import formatISO from 'date-fns/formatISO'
import { ulid } from 'ulid'
import type { EventType } from '../appsync'
import { getTable } from '../dynamo/table'
import { getPrimaryKey } from '../graphql/events/support/event-primary-key'

const Table = getTable()

interface CreatableEvent {
  title: string
  // https://javascript.plainenglish.io/type-safe-date-strings-66b6dc58658a
  dateStart: string
  type: EventType
  subtitle?: string
  race: boolean
}

export const create = async (creatableEvent: CreatableEvent) => {
  const { title, dateStart, type, subtitle, race } = creatableEvent
  const eventId = ulid()
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
