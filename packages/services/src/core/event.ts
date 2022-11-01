import { format } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import startOfToday from 'date-fns/startOfToday'
import { ulid } from 'ulid'
import type { MutationCreateEventArgs, UserInput, Event } from '../appsync.gen'
import { EventType } from '../appsync.gen'
import { getTable } from '../dynamo/table'
import { getPrimaryKey } from './event-primary-key'
import { mapDynamoToEvent } from './map-dynamo-to-event'

const Table = getTable()

// use zod for date formats
interface PersistableEvent {
  PK: string
  SK: string
  GSI1PK: 'EVENT#FUTURE'
  GSI1SK: string
  createdBy: UserInput
  dateStart: string
  id: string
  participants: Record<
    string,
    | UserInput
    | {
        joinedAt: string
      }
  >
  title: string
  location: string
  race: boolean
  type: EventType
}

const getExpression = (d: Date) => {
  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd'
  )
  return `DATE#${lt}`
}

const isEventType = (event: string): event is EventType => {
  return Object.values(EventType).includes(event as EventType)
}

export const create = async (
  creatableEvent: MutationCreateEventArgs['event']
): Promise<Event> => {
  const { title, dateStart, type, location, race, createdBy, participants } =
    creatableEvent
  const eventId = ulid()
  if (!isEventType(type)) {
    throw new Error('Wrong event type provided')
  }
  const startDate = formatISO(new Date(dateStart))
  const now = formatISO(new Date())

  const parts = participants ?? []
  const participantHashMap = {}

  for (const participant of parts) {
    Object.assign(participantHashMap, {
      [participant.id]: {
        joinedAt: now,
        nickname: participant.nickname,
        picture: participant.picture,
        id: participant.id,
      },
    })
  }

  const persistableEvent: PersistableEvent = {
    // add keys
    ...getPrimaryKey(eventId),
    GSI1PK: `EVENT#FUTURE`,
    GSI1SK: `DATE#${startDate}#${eventId.slice(0, 8)}`,
    // add props
    createdBy,
    dateStart: startDate,
    id: eventId,
    participants: participantHashMap,
    title,
    location,
    race: race ?? false,
    type,
  }

  await Table.Dt65Event.put(persistableEvent, { returnValues: 'none' })
  return {
    ...persistableEvent,
    createdBy: {
      ...createdBy,
      joinedAt: now,
    },
    // participants: [],
    participants:
      participants?.map((p) => ({
        ...p,
        joinedAt: now,
      })) ?? [],
  }
}

export const remove = async (id: string): Promise<boolean> => {
  const results = await Table.Dt65Event.delete(getPrimaryKey(id), {
    returnValues: 'ALL_OLD',
  })

  if (!results.Attributes) {
    throw new Error('Event not found')
  }
  return true
}

export const getById = async (id: string) => {
  const result = await Table.Dt65Event.get(getPrimaryKey(id))
  if (!result.Item) {
    return
  }
  return mapDynamoToEvent(result.Item)
}

export const getFutureEvents = async () => {
  const query = getExpression(startOfToday())

  const results = await Table.Dt65Event.query(`EVENT#FUTURE`, {
    index: 'GSI1',
    gt: query,
  })

  return results.Items.map((dynamoEvent: unknown) =>
    mapDynamoToEvent(dynamoEvent)
  )
}
