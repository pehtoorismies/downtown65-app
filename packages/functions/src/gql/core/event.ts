import { DynamoDatetime } from '@downtown65-app/common'
import type {
  CreateEventInput,
  Event,
  IdPayload,
  UpdateEventInput,
} from '@downtown65-app/graphql/appsync.gen'
import { format } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import startOfToday from 'date-fns/startOfToday'
import { ulid } from 'ulid'
import {
  Dt65EventCreateSchema,
  Dt65EventGetSchema,
  Dt65EventUpdateSchema,
  ParticipatingUserSchema,
} from './dynamo-schemas/dt65-event-schema'
import { getTable } from './dynamo-table'

const Table = getTable()

const getExpression = (d: Date) => {
  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd'
  )
  return `DATE#${lt}`
}

const getPrimaryKey = (eventId: string) => {
  return {
    PK: `EVENT#${eventId}`,
    SK: `EVENT#${eventId}`,
  }
}

const mapDynamoToEvent = (persistedDynamoItem: unknown): Event => {
  const result = Dt65EventGetSchema.safeParse(persistedDynamoItem)

  if (!result.success) {
    throw new Error(
      `Error in dynamo item: ${JSON.stringify(persistedDynamoItem)}. Error: ${
        result.error
      }`
    )
  }
  const parsed = result.data
  return {
    ...parsed,
    participants: Object.entries(parsed.participants)
      // eslint-disable-next-line no-unused-vars
      .map(([_, value]) => {
        return {
          ...value,
        }
      })
      .sort((a, b) => {
        if (a.joinedAt < b.joinedAt) {
          return -1
        }
        if (a.joinedAt > b.joinedAt) {
          return 1
        }
        return 0
      }),
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
    subtitle,
    timeStart,
    title,
    type,
  } = creatableEvent
  const eventId = ulid()

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

  await Table.Dt65Event.put(
    Dt65EventCreateSchema.parse({
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
      subtitle,
      timeStart: ddt.getTime(),
      title,
      type,
    }),
    { returnValues: 'none' }
  )

  return {
    id: eventId,
  }
}

export const update = async (
  eventId: string,
  updateEventInput: UpdateEventInput
): Promise<Event> => {
  const { dateStart, timeStart, type, ...rest } = updateEventInput

  const ddt = new DynamoDatetime({
    dates: dateStart,
    times: timeStart,
  })

  const gsi1sk = ddt.getIsoDatetime()

  const update: Dt65EventUpdateSchema = {
    ...getPrimaryKey(eventId),
    ...rest,
    dateStart: ddt.getDate(),
    timeStart: ddt.getTime(),
    GSI1SK: `DATE#${gsi1sk}#${eventId.slice(0, 8)}`,
    type,
  }

  const result = await Table.Dt65Event.update(
    Dt65EventUpdateSchema.parse(update),
    {
      returnValues: 'all_new',
    }
  )

  return mapDynamoToEvent(result.Attributes)
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
  const participatingUser: ParticipatingUserSchema = {
    joinedAt: formatISO(new Date()).slice(0, 19),
    ...user,
  }

  try {
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
          ':user': ParticipatingUserSchema.parse(participatingUser),
        },
      })
      .promise()
  } catch (error) {
    if (isError(error) && error.name !== 'ConditionalCheckFailedException') {
      console.error(error)
    }
  }
}

function isError(error: unknown): error is Error {
  return (error as Error).name !== undefined
}

export const leave = async (eventId: string, userId: string) => {
  const documentClient = Table.DocumentClient
  if (!documentClient) {
    throw new Error('No Dynamo Document client')
  }
  try {
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
  } catch (error) {
    if (isError(error) && error.name !== 'ConditionalCheckFailedException') {
      console.error(error)
    }
  }
}
