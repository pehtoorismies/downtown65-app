import { AppSyncResolverHandler } from 'aws-lambda'
import formatISO from 'date-fns/formatISO'
import { v4 as uuidv4 } from 'uuid'
import {
  QueryEventArgs as QueryEventArguments,
  Event as Dt65Event,
  MutationCreateEventArgs,
} from '../appsync'
import { getTable } from '../functions/db/table'
import { getPrimaryKey } from '../functions/events/support/event-primary-key'
import { EventType } from '../functions/support/event-type'
import { LegacyEvent } from './support/event'
import { toLegacyEvent } from './support/legacy-api'

interface EventData {
  title: string
  subtitle?: string
  race?: boolean
  type: EventType
  date: string
  exactTime: boolean
}

export type CreateEventArguments = {
  event: EventData
  addMe: boolean
  notifySubscribers: boolean
}

export const createEvent: AppSyncResolverHandler<
  MutationCreateEventArgs,
  Dt65Event
> = async (event) => {
  const Table = getTable()

  const { title, date, type, subtitle, race } = event.arguments.event

  const eventId = uuidv4()
  const startDate = formatISO(new Date(date))

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

  return toLegacyEvent({
    id: eventId,
    title,
    subtitle: subtitle ?? undefined,
    race: race ?? false,
    type: type as EventType,
  })
}
