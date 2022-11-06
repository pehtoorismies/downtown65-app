import { format } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import startOfToday from 'date-fns/startOfToday'
import { ulid } from 'ulid'
import type {
  Event,
  MutationCreateEventArgs,
  MeInput,
  IdPayload,
} from '../appsync.gen'
import { EventType } from '../appsync.gen'
import { getTable } from '../dynamo/table'
import { getPrimaryKey } from './event-primary-key'
import { getIsoDatetime, getTime, getDate } from './get-iso-datetime'
import { mapDynamoToEvent } from './map-dynamo-to-event'

const Table = getTable()

// use zod for date formats
interface PersistableEvent {
  PK: string
  SK: string
  GSI1PK: 'EVENT#FUTURE'
  GSI1SK: string
  createdBy: MeInput
  dateStart: string
  description?: string
  id: string
  location: string
  participants: Record<
    string,
    | MeInput
    | {
        joinedAt: string
      }
  >
  race: boolean
  timeStart?: string
  title: string
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
  creatableEvent: MutationCreateEventArgs['input']
): Promise<IdPayload> => {
  const {
    createdBy,
    dateStart,
    description,
    location,
    participants,
    race,
    timeStart,
    title,
    type,
  } = creatableEvent

  const eventId = ulid()
  if (!isEventType(type)) {
    throw new Error('Wrong event type provided')
  }

  const gsi1sk = getIsoDatetime(dateStart, timeStart)
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
    GSI1SK: `DATE#${gsi1sk}#${eventId.slice(0, 8)}`,
    // add props
    createdBy,
    dateStart: getDate(dateStart),
    description,
    id: eventId,
    location,
    participants: participantHashMap,
    race: race ?? false,
    timeStart: getTime(timeStart),
    title,
    type,
  }

  await Table.Dt65Event.put(persistableEvent, { returnValues: 'none' })

  return {
    id: eventId,
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

export const getById = async (id: string): Promise<Event | undefined> => {
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

export const participate = async (
  eventId: string,
  user: { nickname: string; id: string; picture: string }
) => {
  Table.Dt65Event.update(
    {
      ...getPrimaryKey(eventId),
      participants: {
        $set: {
          [user.id]: {
            ...user,
            joinedAt: formatISO(new Date()),
          },
        },
      },
    },
    { conditions: { attr: 'title', exists: true } }
  )
}

export const leave = async (eventId: string, userId: string) => {
  const documentClient = Table.DocumentClient
  if (!documentClient) {
    throw new Error('No Dynamo Document client')
  }

  await documentClient
    .update({
      TableName: Table.name,
      Key: getPrimaryKey(eventId),
      UpdateExpression: 'REMOVE #participants.#userId',
      ExpressionAttributeNames: {
        '#participants': 'participants',
        '#userId': userId,
      },
    })
    .promise()

  return true
}
