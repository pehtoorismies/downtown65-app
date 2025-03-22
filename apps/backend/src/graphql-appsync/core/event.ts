import { logger } from '@downtown65-app/logger'
import { toISODate, toISODatetimeCompact } from '@downtown65-app/time'
import type {
  CreateEventInput,
  Event,
  UpdateEventInput,
} from '@downtown65-app/types'
import { format, formatISO, startOfToday } from 'date-fns'

import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import {
  $remove,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from 'dynamodb-toolbox'
import { ulid } from 'ulid'
import {
  ParticipantsSchema,
  ParticipatingUserSchema,
} from '~/graphql-appsync/core/dynamo-schemas/common'
import type { EventUpdateSchemaInput } from './dynamo-schemas/event-schema'
import {
  EventCreateSchema,
  EventGetSchema,
  EventUpdateSchema,
} from './dynamo-schemas/event-schema'
import { Dt65EventEntity, DtTable } from './dynamo-table'

const getExpression = (d: Date) => {
  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd',
  )
  return `DATE#${lt}`
}

const getPrimaryKey = (eventId: string) => {
  return {
    PK: `EVENT#${eventId}`,
    SK: `EVENT#${eventId}`,
  }
}

const participantHashMapToList = (participantsHashMap: unknown) => {
  const parsed = ParticipantsSchema.safeParse(participantsHashMap)
  if (!parsed.success) {
    throw new Error(
      `Error in dynamo item participants: ${JSON.stringify(
        participantsHashMap,
      )}. Error: ${parsed.error}`,
    )
  }

  return (
    Object.entries(parsed.data)
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
      })
  )
}

const mapDynamoToEvent = (persistedDynamoItem: unknown): Event => {
  const result = EventGetSchema.safeParse(persistedDynamoItem)

  if (!result.success) {
    throw new Error(
      `Error in dynamo item: ${JSON.stringify(persistedDynamoItem)}. Error: ${
        result.error
      }`,
    )
  }
  const parsed = result.data
  return {
    ...parsed,
    id: parsed.eventId,
    __typename: 'Event',
    createdBy: {
      __typename: 'Creator',
      ...parsed.createdBy,
    },
    participants: participantHashMapToList(result.data.participants).map(
      (p) => ({
        ...p,
        __typename: 'Participant',
      }),
    ),
  }
}

export const create = async (
  creatableEvent: CreateEventInput,
): Promise<string> => {
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

  const gsi1sk = toISODatetimeCompact(dateStart, timeStart ?? undefined)
  const nowDate = toISODate(new Date())
  if (!nowDate.success) {
    throw new Error('Unexpected error formatting toISODate(new Date())')
  }
  const nowISOString = toISODatetimeCompact(nowDate.data)

  const parts = participants ?? []
  const participantHashMap = {}

  for (const participant of parts) {
    Object.assign(participantHashMap, {
      [participant.id]: {
        joinedAt: nowISOString,
        nickname: participant.nickname,
        picture: participant.picture,
        id: participant.id,
      },
    })
  }
  logger.debug(creatableEvent, 'Creatable event')

  await Dt65EventEntity.build(PutItemCommand)
    .item(
      EventCreateSchema.parse({
        // add keys
        ...getPrimaryKey(eventId),
        GSI1PK: 'EVENT#FUTURE',
        GSI1SK: `DATE#${gsi1sk}#${eventId.slice(0, 8)}`,
        // add props
        createdBy,
        dateStart,
        description,
        eventId,
        location,
        participants: participantHashMap,
        race,
        subtitle,
        timeStart,
        title,
        type,
      }),
    )
    .options({
      returnValues: 'NONE',
    })
    .send()

  return eventId
}

export const update = async (
  eventId: string,
  updateEventInput: UpdateEventInput,
): Promise<Event> => {
  const { dateStart, description, timeStart, type, ...rest } = updateEventInput

  const gsi1sk = toISODatetimeCompact(dateStart, timeStart ?? undefined)

  const update: EventUpdateSchemaInput = {
    ...getPrimaryKey(eventId),
    ...rest,
    dateStart,
    timeStart: timeStart ?? undefined,
    description: description ?? undefined,
    GSI1SK: `DATE#${gsi1sk}#${eventId.slice(0, 8)}`,
    type,
  }

  const values = EventUpdateSchema.parse(update)
  const removable = {
    ...values,
    description: values.description ?? $remove(),
    timeStart: values.timeStart ?? $remove(),
  }

  const result = await Dt65EventEntity.build(UpdateItemCommand)
    .item(removable)
    .options({ returnValues: 'ALL_NEW' })
    .send()

  return mapDynamoToEvent(result.Attributes)
}

export const remove = async (id: string): Promise<boolean> => {
  const results = await Dt65EventEntity.build(DeleteItemCommand)
    .key(getPrimaryKey(id))
    .options({ returnValues: 'ALL_OLD' })
    .send()

  if (!results.Attributes) {
    throw new Error('Event not found')
  }
  return true
}

export const getById = async (id: string): Promise<Event | null> => {
  const result = await Dt65EventEntity.build(GetItemCommand)
    .key(getPrimaryKey(id))
    .send()

  if (!result.Item) {
    return null
  }
  return mapDynamoToEvent(result.Item)
}

export const getFutureEvents = async () => {
  const query = getExpression(startOfToday())

  const results = await DtTable.build(QueryCommand)
    .query({
      partition: 'EVENT#FUTURE',
      index: 'GSI1',
      range: { gt: query },
    })
    .send()

  return (
    results.Items?.map((dynamoEvent: unknown) =>
      mapDynamoToEvent(dynamoEvent),
    ) ?? []
  )
}

function isError(error: unknown): error is Error {
  return (error as Error).name !== undefined
}

export const participate = async (
  id: string,
  user: { nickname: string; id: string; picture: string },
) => {
  const participatingUser: ParticipatingUserSchema = {
    joinedAt: formatISO(new Date()).slice(0, 19),
    ...user,
  }

  const command = new UpdateCommand({
    Key: getPrimaryKey(id),
    TableName: DtTable.getName(),
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

  try {
    await DtTable.getDocumentClient().send(command)
  } catch (error) {
    if (isError(error) && error.name !== 'ConditionalCheckFailedException') {
      console.error(error)
    }
  }
}

export const leave = async (id: string, userId: string) => {
  const command = new UpdateCommand({
    Key: getPrimaryKey(id),
    TableName: DtTable.getName(),
    UpdateExpression: 'REMOVE #participants.#userId',
    ConditionExpression: 'attribute_exists(#participants.#userId)',
    ExpressionAttributeNames: {
      '#participants': 'participants',
      '#userId': userId,
    },
  })

  try {
    await DtTable.getDocumentClient().send(command)
  } catch (error) {
    if (isError(error) && error.name !== 'ConditionalCheckFailedException') {
      console.error(error)
    }
  }
}
