import { ISODate } from '@downtown65-app/time'
import { isBefore } from 'date-fns'
import { z } from 'zod'
import {
  Auth0IDString,
  Auth0UserSchema,
  ParticipantsSchema,
  UlidSchema,
  getKeySchema,
} from '~/graphql-appsync/core/dynamo-schemas/common'

const ChallengeKeySchema = getKeySchema('CHALLENGE')

// EVENT#<ulid>
const KeyPattern = /^CHALLENGE#(?<id>[\dA-HJKMNP-TV-Z]{26})$/

const createGSI1SKVerifier = ({
  PK,
  dateEnd,
}: {
  PK: string
  dateEnd: string
}) => {
  const id = PK.match(KeyPattern)?.groups?.id
  return `DATE#${dateEnd}#${id?.slice(0, 8)}`
}

export const ChallengeGetSchema = z.object({
  id: UlidSchema,
  dateStart: ISODate,
  dateEnd: ISODate,
  title: z.string(),
  subtitle: z.string(),
  description: z.string().optional(),
  createdBy: Auth0UserSchema,
  participants: ParticipantsSchema,
})

export const ChallengeCreateSchema = z
  .object({
    PK: ChallengeKeySchema,
    SK: ChallengeKeySchema,
    GSI1PK: z.literal('CHALLENGE#CHALLENGE'),
    GSI1SK: z.string().refine(
      (value) => /^DATE#\d{4}-\d{2}-\d{2}#[\dA-HJKMNP-TV-Z]{8}$/.test(value),
      (value) => {
        return {
          message: `GSI1SK: ${value} is not correct. Use: DATE#2023-03-22#01GW4MMH`,
        }
      },
    ),
    createdBy: Auth0UserSchema,
    id: UlidSchema, // TODO: fix this is eventId in Dynamo
    description: z.string().trim().optional(),
    subtitle: z.string().trim(),
    title: z.string().trim(),
    dateStart: ISODate,
    dateEnd: ISODate,
    participants: ParticipantsSchema,
  })
  .refine(
    ({ PK, SK }) => PK === SK,
    ({ PK, SK }) => ({
      message: `PK (${PK}) and SK (${SK}) don't match`,
      path: ['PK'],
    }),
  )
  .refine(
    (value) => {
      // DATE#2023-03-22#01GW4MMH
      const id = value.PK.match(KeyPattern)?.groups?.id

      if (!id) {
        return false
      }

      const gsi1SKVerifier = createGSI1SKVerifier(value)
      return gsi1SKVerifier === value.GSI1SK
    },
    (value) => {
      const id = value.PK.match(KeyPattern)?.groups?.id
      if (!id) {
        return {
          message: 'PK is incorrect can not form GSI1SK',
          path: ['PK'],
        }
      }

      return {
        message: `GSI1SK is incorrect:
    Given:    ${value.GSI1SK}
    Correct:  ${createGSI1SKVerifier(value)}`,
        path: ['GSI1SK'],
      }
    },
  )
  .refine(
    ({ dateStart, dateEnd }) => {
      return isBefore(new Date(dateStart), new Date(dateEnd))
    },
    ({ dateStart, dateEnd }) => ({
      message: `dateEnd (${dateEnd}) is before dateStart  (${dateStart})`,
      path: ['dateStart'],
    }),
  )

export type ChallengeCreateSchema = z.infer<typeof ChallengeCreateSchema>

export const ChallengeAccomplishmentSchema = z.object({
  challengeAccomplishments: z.string().array(),
  userId: Auth0IDString,
})
