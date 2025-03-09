import { isValid } from 'date-fns'
import { z } from 'zod'

export const getKeySchema = (key: 'EVENT' | 'CHALLENGE') => {
  // <type>#<ulid>
  const re = new RegExp(`^${key}#(?<id>[\\dA-HJKMNP-TV-Z]{26})$`)
  return z.string().refine(
    (value) => re.test(value),
    (value) => ({
      message: `${value} is not in correct for PK. Use: ${key}#<ulid>`,
    }),
  )
}

export const UlidSchema = z.string().ulid()

export const Auth0IDString = z.string().startsWith('auth0|')
const UrlString = z.string().startsWith('https://')

export const Auth0UserSchema = z.object({
  nickname: z.string(),
  picture: UrlString,
  id: Auth0IDString,
})

// 2020-01-01T00:00:00
const DateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?/

export const ParticipatingUserSchema = z.object({
  joinedAt: z.string().refine(
    (value) => {
      return isValid(new Date(value)) && DateTimePattern.test(value)
    },
    (value) => ({
      message: `${value} is not in correct format. Use: 2020-01-01T00:00:00`,
    }),
  ),
  nickname: z.string(),
  picture: UrlString,
  id: Auth0IDString,
})

export type ParticipatingUserSchema = z.infer<typeof ParticipatingUserSchema>

export const ParticipantsSchema = z.record(
  Auth0IDString,
  ParticipatingUserSchema,
)
