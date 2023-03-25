import { DynamoDatetime } from '@downtown65-app/common'
import { isValid } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import { z } from 'zod'
import type { CreateEventInput } from '~/appsync.gen'
import { EventType } from '~/appsync.gen'

const PKulidPattern = /^EVENT#[\dA-HJKMNP-TV-Z]{26}$/
const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/

const Auth0IDString = z.string().startsWith('auth0|')
const UrlString = z.string().startsWith('auth0|')

const Auth0UserSchema = z.object({
  nickname: z.string(),
  picture: UrlString,
  id: Auth0IDString,
})

const Dt65EventSchema = z
  .object({
    PK: z.string().refine(
      (value) => PKulidPattern.test(value),
      (value) => ({
        message: `${value} is not in correct for PK. Use: EVENT#<ulid>`,
      })
    ),
    SK: z.string(),
    GSI1PK: z.literal('EVENT#FUTURE'),
    GSI1SK: z.string().startsWith('DATE#'), // DATE#2023-03-22T14:55:00#01GW4MMH
    createdBy: Auth0UserSchema,
    dateStart: z.string().refine(
      (value) => {
        return isValid(new Date(value)) && datePattern.test(value)
      },
      (value) => ({
        message: `${value} is not in correct format. Use: 2020-01-01`,
      })
    ),
    description: z.string().trim().optional(),
    id: z.string().ulid(), // TODO: fix this is eventId in Dynamo
    location: z.string().trim(),
    participants: z.record(
      Auth0IDString,
      z.object({
        joinedAt: z.string().refine(
          (value) => {
            return isValid(new Date(value)) && dateTimePattern.test(value)
          },
          (value) => ({
            message: `${value} is not in correct format. Use: 2020-01-01T00:00:00`,
          })
        ),
        nickname: z.string(),
        picture: UrlString,
        id: Auth0IDString,
      })
    ),
    race: z.boolean(),
    subtitle: z.string().trim(),
    timeStart: z
      .string()
      .refine(
        (value) => {
          return timePattern.test(value)
        },
        (value) => ({
          message: `${value} is not in correct format. Use: 23:59`,
        })
      )
      .optional(),
    title: z.string().trim(),
    type: z.nativeEnum(EventType),
  })
  .refine(
    ({ PK, SK }) => PK === SK,
    ({ PK, SK }) => ({
      message: `PK (${PK}) and SK (${SK}) don't match`,
    })
  )
  .refine(
    ({ GSI1SK, id, dateStart, timeStart }) => {
      // DATE#2023-03-22T14:55:00#01GW4MMH
      const time = timeStart ?? '00:00'
      const gsi1SKVerifier = `DATE#${dateStart}T${time}:00#${id.slice(0, 8)}`
      return gsi1SKVerifier === GSI1SK
    },
    ({ GSI1SK }) => ({
      message: `GSI1SK: ${GSI1SK} is not correct. Use: DATE#2023-03-22T14:55:00#01GW4MMH`,
    })
  )

type Dt65EventSchema = z.infer<typeof Dt65EventSchema>

export const transform = (
  creatableEvent: CreateEventInput,
  id: string
): Dt65EventSchema => {
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

  return Dt65EventSchema.parse({
    // add keys
    PK: `EVENT#${id}`,
    SK: `EVENT#${id}`,
    GSI1PK: `EVENT#FUTURE`,
    GSI1SK: `DATE#${gsi1sk}#${id.slice(0, 8)}`,
    // add props
    createdBy,
    dateStart: ddt.getDate(),
    description,
    id,
    location,
    participants: participantHashMap,
    race: race ?? false,
    subtitle,
    timeStart: ddt.getTime(),
    title,
    type,
  })
}
