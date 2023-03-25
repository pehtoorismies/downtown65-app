import { isValid } from 'date-fns'
import { z } from 'zod'
import { EventType } from '~/appsync.gen'

// EVENT#<ulid>
const KeyPattern = /^EVENT#(?<id>[\dA-HJKMNP-TV-Z]{26})$/
// 2020-01-01T00:00:00
const DateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
// 2020-01-01
const DatePattern = /^\d{4}-\d{2}-\d{2}$/
// 13:00
const TimePattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/
// DATE#2023-03-22T14:55:00#01GW4MMH
const GSI1SKPattern =
  /^DATE#\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}#[\dA-HJKMNP-TV-Z]{8}$/

const Auth0IDString = z.string().startsWith('auth0|')
const UrlString = z.string().startsWith('https://')

const Auth0UserSchema = z.object({
  nickname: z.string(),
  picture: UrlString,
  id: Auth0IDString,
})

const EventKeySchema = z.string().refine(
  (value) => KeyPattern.test(value),
  (value) => ({
    message: `${value} is not in correct for PK. Use: EVENT#<ulid>`,
  })
)

export const ParticipatingUserSchema = z.object({
  joinedAt: z.string().refine(
    (value) => {
      return isValid(new Date(value)) && DateTimePattern.test(value)
    },
    (value) => ({
      message: `${value} is not in correct format. Use: 2020-01-01T00:00:00`,
    })
  ),
  nickname: z.string(),
  picture: UrlString,
  id: Auth0IDString,
})

export type ParticipatingUserSchema = z.infer<typeof ParticipatingUserSchema>

const ParticipantsSchema = z.record(Auth0IDString, ParticipatingUserSchema)

const IDSchema = z.string().ulid()

const createGSI1SKVerifier = ({
  PK,
  timeStart,
  dateStart,
}: {
  PK: string
  timeStart?: string | undefined
  dateStart: string
}) => {
  const id = PK.match(KeyPattern)?.groups?.id
  const time = timeStart ?? '00:00'
  return `DATE#${dateStart}T${time}:00#${id?.slice(0, 8)}`
}

const gs1SKErrorMessage = (value: {
  PK: string
  GSI1SK: string
  dateStart: string
  timeStart?: string | undefined
}) => {
  const id = value.PK.match(KeyPattern)?.groups?.id
  if (!id) {
    return {
      message: `PK is incorrect can not form GSI1SK`,
      path: ['PK'],
    }
  }

  return {
    message: `GSI1SK is incorrect:
    Given:    ${value.GSI1SK}
    Correct:  ${createGSI1SKVerifier(value)}`,
    path: ['GSI1SK'],
  }
}

const GS1SKSchema = z.string().refine(
  (value) => GSI1SKPattern.test(value),
  (value) => {
    return {
      message: `GSI1SK: ${value} is not correct. Use: DATE#2023-03-22T14:55:00#01GW4MMH`,
    }
  }
)

const gsi1skRefine = (value: {
  PK: string
  timeStart?: string | undefined
  dateStart: string
  GSI1SK: string
}) => {
  // DATE#2023-03-22T14:55:00#01GW4MMH
  const id = value.PK.match(KeyPattern)?.groups?.id

  if (!id) {
    return false
  }

  const gsi1SKVerifier = createGSI1SKVerifier(value)
  return gsi1SKVerifier === value.GSI1SK
}

const Dt65EventUpdateableFields = z.object({
  dateStart: z.string().refine(
    (value) => {
      return isValid(new Date(value)) && DatePattern.test(value)
    },
    (value) => ({
      message: `${value} is not in correct format. Use: 2020-01-01`,
    })
  ),
  description: z.string().trim().optional(),
  location: z.string().trim(),
  race: z.boolean(),
  subtitle: z.string().trim(),
  timeStart: z
    .string()
    .refine(
      (value) => TimePattern.test(value),
      (value) => ({
        message: `${value} is not in correct format. Use: 23:59`,
      })
    )
    .optional(),
  title: z.string().trim(),
  type: z.nativeEnum(EventType),
})

export const Dt65EventCreateSchema = Dt65EventUpdateableFields.extend({
  PK: EventKeySchema,
  SK: EventKeySchema,
  GSI1PK: z.literal('EVENT#FUTURE'),
  GSI1SK: GS1SKSchema,
  createdBy: Auth0UserSchema,
  id: IDSchema, // TODO: fix this is eventId in Dynamo
  participants: ParticipantsSchema,
})
  .refine(
    ({ PK, SK }) => PK === SK,
    ({ PK, SK }) => ({
      message: `PK (${PK}) and SK (${SK}) don't match`,
      path: ['PK'],
    })
  )
  .refine(gsi1skRefine, gs1SKErrorMessage)

export const Dt65EventGetSchema = Dt65EventUpdateableFields.extend({
  createdBy: Auth0UserSchema,
  id: IDSchema, // TODO: fix this is eventId in Dynamo
  participants: ParticipantsSchema,
})

export type Dt65EventCreateSchema = z.infer<typeof Dt65EventCreateSchema>

export const Dt65EventUpdateSchema = Dt65EventUpdateableFields.extend({
  PK: EventKeySchema,
  SK: EventKeySchema,
  GSI1SK: GS1SKSchema,
})
  .refine(
    ({ PK, SK }) => PK === SK,
    ({ PK, SK }) => ({
      message: `PK (${PK}) and SK (${SK}) don't match`,
      path: ['PK'],
    })
  )
  .refine(gsi1skRefine, gs1SKErrorMessage)

export type Dt65EventUpdateSchema = z.infer<typeof Dt65EventUpdateSchema>
