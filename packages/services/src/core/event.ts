import { DynamoDatetime } from '@downtown65-app/common'
import { format } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import startOfToday from 'date-fns/startOfToday'
import { ulid } from 'ulid'
import type {
  Event,
  MeInput,
  IdPayload,
  CreateEventInput,
} from '../appsync.gen'
import { EventType } from '../appsync.gen'
import { getTable } from '../dynamo/table'
import { getPrimaryKey } from './event-primary-key'
import { mapDynamoToEvent } from './map-dynamo-to-event'
import { getImportedEvents } from '~/import-old/get-imported-events'

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

export const importEvents = async (): Promise<{ id: string }> => {
  const events = getImportedEvents()
  // return { id: '123' }
  for await (const event of events) {
    const {
      id,
      createdBy,
      dateStart,
      description,
      location,
      participants,
      race,
      timeStart,
      title,
      type,
    } = event

    // return { id }

    const eventId = id

    if (!isEventType(type)) {
      throw new Error(`Wrong event type provided '${type}'`)
    }

    const ddt = new DynamoDatetime({
      dates: dateStart,
      times: timeStart,
    })

    const gsi1sk = ddt.getIsoDatetime()
    const now = formatISO(new Date()).slice(0, 19)

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
      dateStart: ddt.getDate(),
      description,
      id: eventId,
      location,
      participants: participantHashMap,
      race: race ?? false,
      timeStart: ddt.getTime(),
      title,
      type,
    }

    await Table.Dt65Event.put(persistableEvent, { returnValues: 'none' })
  }
  return {
    id: '123',
  }
}

export const create = async (
  creatableEvent: CreateEventInput
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

  const ddt = new DynamoDatetime({
    dates: dateStart,
    times: timeStart,
  })

  const gsi1sk = ddt.getIsoDatetime()
  const now = formatISO(new Date()).slice(0, 19)

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
    dateStart: ddt.getDate(),
    description,
    id: eventId,
    location,
    participants: participantHashMap,
    race: race ?? false,
    timeStart: ddt.getTime(),
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
  const documentClient = Table.DocumentClient
  if (!documentClient) {
    throw new Error('No Dynamo Document client')
  }

  await documentClient
    .update({
      TableName: Table.name,
      Key: getPrimaryKey(eventId),
      UpdateExpression: 'SET #participants.#userId = :user',
      ConditionExpression: 'attribute_not_exists(#participants.#userId)',
      ExpressionAttributeNames: {
        '#participants': 'participants',
        '#userId': user.id,
      },
      ExpressionAttributeValues: {
        ':user': {
          joinedAt: formatISO(new Date()),
          ...user,
        },
      },
    })
    .promise()
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
      ConditionExpression: 'attribute_exists(#participants.#userId)',
      ExpressionAttributeNames: {
        '#participants': 'participants',
        '#userId': userId,
      },
    })
    .promise()

  return true
}
