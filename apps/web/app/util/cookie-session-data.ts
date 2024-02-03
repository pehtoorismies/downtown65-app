import type { Session } from '@remix-run/node'
import { z } from 'zod'
import { User } from '~/domain/user'

const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'
const ACCESS_TOKEN_KEY = 'accessToken'
const COOKIE_EXPIRES = 'cookieExpires'

export const CookieSessionData = z
  .object({
    user: User,
    accessToken: z.string(),
    refreshToken: z.string(),
    cookieExpires: z.string().datetime(),
  })
  .brand<'CookieSessionData'>()

export type CookieSessionData = z.infer<typeof CookieSessionData>

export const getCookieSessionData = (
  session: Session
): CookieSessionData | undefined => {
  const user = session.get(USER_KEY)
  const accessToken = session.get(ACCESS_TOKEN_KEY)
  const refreshToken = session.get(REFRESH_TOKEN_KEY)
  const cookieExpires = session.get(COOKIE_EXPIRES)

  const sessionData = CookieSessionData.safeParse({
    user: user == null ? undefined : JSON.parse(user),
    accessToken,
    refreshToken,
    cookieExpires,
  })

  if (sessionData.success) {
    return sessionData.data
  }
}

export const setCookieSessionData = (
  session: Session,
  { refreshToken, user, accessToken, cookieExpires }: CookieSessionData
) => {
  session.set(REFRESH_TOKEN_KEY, refreshToken)
  session.set(USER_KEY, JSON.stringify(user))
  session.set(ACCESS_TOKEN_KEY, accessToken)
  session.set(COOKIE_EXPIRES, cookieExpires)
}
