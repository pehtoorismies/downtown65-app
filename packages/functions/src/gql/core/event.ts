import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import type {
  CreateEventInput,
  Event,
  UpdateEventInput,
} from '@downtown65-app/graphql/graphql'
import { format } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import startOfToday from 'date-fns/startOfToday'
import { ulid } from 'ulid'
import {
  Dt65EventCreateSchema,
  Dt65EventGetSchema,
  Dt65EventUpdateSchema,
} from './dynamo-schemas/dt65-event-schema'
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

const getDefaultIfEmpty = (value: string) => {
  return value.trim().length === 0 ? 'ei määritelty' : value
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

  const ddt = DynamoDatetime.fromComponents(dateStart, timeStart ?? undefined)

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

  await Dt65EventEntity.put(
    Dt65EventCreateSchema.parse({
      // add keys
      ...getPrimaryKey(eventId),
      GSI1PK: `EVENT#FUTURE`,
      GSI1SK: `DATE#${gsi1sk}#${eventId.slice(0, 8)}`,
      // add props
      createdBy,
      dateStart: ddt.getISODate(),
      description,
      id: eventId,
      location: getDefaultIfEmpty(location),
      participants: participantHashMap,
      race: race ?? false,
      subtitle: getDefaultIfEmpty(subtitle),
      timeStart: ddt.getTime(),
      title: getDefaultIfEmpty(title),
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
  const { dateStart, timeStart, type, ...rest } = updateEventInput

  const ddt = DynamoDatetime.fromComponents(dateStart, timeStart ?? undefined)

  const gsi1sk = ddt.getIsoDatetime()

  const update: Dt65EventUpdateSchema = {
    ...getPrimaryKey(eventId),
    ...rest,
    description: rest.description ?? undefined,
    dateStart: ddt.getISODate(),
    timeStart: ddt.getTime(),
    GSI1SK: `DATE#${gsi1sk}#${eventId.slice(0, 8)}`,
    type,
  }

  const result = await Dt65EventEntity.update(
    Dt65EventUpdateSchema.parse(update),
    {
      returnValues: 'ALL_NEW',
    }
  )

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
