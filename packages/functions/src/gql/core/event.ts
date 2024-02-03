import type {
  CreateEventInput,
  Event,
  UpdateEventInput,
} from '@downtown65-app/graphql/graphql'
import { logger } from '@downtown65-app/logger'
import { toISODate, toISODatetimeCompact } from '@downtown65-app/time'
import { format, startOfToday } from 'date-fns'
import { ulid } from 'ulid'
import type { EventUpdateSchemaInput } from './dynamo-schemas/event-schema'
import {
  EventCreateSchema,
  EventGetSchema,
  EventUpdateSchema,
} from './dynamo-schemas/event-schema'
import { Dt65EventEntity } from './dynamo-table'
import {
  getParticipationFunctions,
  participantHashMapToList,
} from '~/gql/core/common'

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
  const result = EventGetSchema.safeParse(persistedDynamoItem)

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
    __typename: 'Event',
    createdBy: {
      __typename: 'Creator',
      ...parsed.createdBy,
    },
    participants: participantHashMapToList(result.data.participants).map(
      (p) => ({
        ...p,
        __typename: 'Participant',
      })
    ),
  }
}

export const create = async (
  creatableEvent: CreateEventInput
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
  await Dt65EventEntity.put(
    EventCreateSchema.parse({
      // add keys
      ...getPrimaryKey(eventId),
      GSI1PK: `EVENT#FUTURE`,
      GSI1SK: `DATE#${gsi1sk}#${eventId.slice(0, 8)}`,
      // add props
      createdBy,
      dateStart,
      description,
      id: eventId,
      location,
      participants: participantHashMap,
      race,
      subtitle,
      timeStart,
      title,
      type,
    }),
    { returnValues: 'NONE' }
  )

  return eventId
}

export const update = async (
  eventId: string,
  updateEventInput: UpdateEventInput
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

  const result = await Dt65EventEntity.update(EventUpdateSchema.parse(update), {
    returnValues: 'ALL_NEW',
  })

  return mapDynamoToEvent(result.Attributes)
}

export const remove = async (id: string): Promise<boolean> => {
  const results = await Dt65EventEntity.delete(getPrimaryKey(id), {
    returnValues: 'ALL_OLD',
  })

  if (!results.Attributes) {
    throw new Error('Event not found')
  }
  return true
}

export const getById = async (id: string): Promise<Event | null> => {
  const result = await Dt65EventEntity.get(getPrimaryKey(id))

  if (!result.Item) {
    return null
  }
  return mapDynamoToEvent(result.Item)
}

export const getFutureEvents = async () => {
  const query = getExpression(startOfToday())

  const results = await Dt65EventEntity.query(`EVENT#FUTURE`, {
    index: 'GSI1',
    gt: query,
  })

  return (
    results.Items?.map((dynamoEvent: unknown) =>
      mapDynamoToEvent(dynamoEvent)
    ) ?? []
  )
}

const participationFunctions = getParticipationFunctions({
  documentClient: Dt65EventEntity.DocumentClient,
  getPrimaryKey,
  tableName: Dt65EventEntity.table?.name,
})

export const participate = participationFunctions.participate
export const leave = participationFunctions.leave
