import { assertUnreachable } from '@downtown65-app/core/assert-unreachable'
import { graphql } from '@downtown65-app/graphql/gql'
import { RefreshTokenDocument } from '@downtown65-app/graphql/graphql'
import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { addDays, addMonths, isAfter, parseISO } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import { Config } from 'sst/node/config'
import { z } from 'zod'
import { User } from '~/domain/user'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { logger } from '~/util/logger.server'

const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'
const ACCESS_TOKEN_KEY = 'accessToken'
const COOKIE_EXPIRES = 'cookieExpires'

const Tokens = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  idToken: z.string(),
})

type Tokens = z.infer<typeof Tokens>

const Jwt = z.object({
  exp: z.number(),
})

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [Config.COOKIE_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const getSession = (request: Request) => {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

interface CreateUserSession {
  request: Request
  tokens: Tokens
  redirectTo: string
  rememberMe: boolean
}

const _GglIgnored = graphql(`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      __typename
      ...RefreshTokensFragment
      ...RefreshErrorFragment
    }
  }
  fragment RefreshTokensFragment on RefreshTokens {
    accessToken
    idToken
  }
  fragment RefreshErrorFragment on RefreshError {
    error
    message
    statusCode
  }
`)

const SessionData = z
  .object({
    user: User,
    accessToken: z.string(),
    refreshToken: z.string(),
    cookieExpires: z.string().datetime(),
  })
  .brand<'SessionData'>()

type SessionData = z.infer<typeof SessionData>

const getSessionData = (session: Session): SessionData | undefined => {
  const user = session.get(USER_KEY)
  const accessToken = session.get(ACCESS_TOKEN_KEY)
  const refreshToken = session.get(REFRESH_TOKEN_KEY)
  const cookieExpires = session.get(COOKIE_EXPIRES)

  const sessionData = SessionData.safeParse({
    user: user == null ? undefined : JSON.parse(user),
    accessToken,
    refreshToken,
    cookieExpires,
  })

  if (sessionData.success) {
    return sessionData.data
  }
}

const setSessionData = (
  session: Session,
  { refreshToken, user, accessToken, cookieExpires }: SessionData
) => {
  session.set(REFRESH_TOKEN_KEY, refreshToken)
  session.set(USER_KEY, JSON.stringify(user))
  session.set(ACCESS_TOKEN_KEY, accessToken)
  session.set(COOKIE_EXPIRES, cookieExpires)
}

const getUserFromJwt = (idTokenJWT: string): User => {
  const decoded = jwtDecode(idTokenJWT)
  return User.parse({
    ...decoded,
    id: decoded.sub,
  })
}

const renewSession = async (oldSessionData: SessionData, session: Session) => {
  const { refreshToken: result } = await gqlClient.request(
    RefreshTokenDocument,
    {
      refreshToken: oldSessionData.refreshToken,
    },
    PUBLIC_AUTH_HEADERS
  )

  switch (result.__typename) {
    case 'RefreshTokens': {
      const user = getUserFromJwt(result.idToken)

      const sessionData = SessionData.parse({
        refreshToken: oldSessionData.refreshToken,
        user,
        accessToken: result.accessToken,
        cookieExpires: oldSessionData.cookieExpires,
      })

      setSessionData(session, sessionData)
      const headers = new Headers()
      headers.append(
        'Set-Cookie',
        await sessionStorage.commitSession(session, {
          expires: parseISO(oldSessionData.cookieExpires),
        })
      )
      return { headers, user, accessToken: result.accessToken }
    }
    case 'RefreshError': {
      logger.error(result.error, 'Error Refreshing token')
      throw redirect('/login')
    }
  }

  // make sure switch case is exhaustive
  const { __typename } = result
  assertUnreachable(__typename)
}

const getAuthentication = async (
  request: Request
): Promise<
  | {
      user: User
      accessToken: string
      headers: Headers
    }
  | undefined
> => {
  const session = await getSession(request)
  const sessionData = getSessionData(session)
  if (!sessionData) {
    return
  }

  const decoded = jwtDecode(sessionData.accessToken)
  const { exp } = Jwt.parse(decoded)

  const expirationDate = new Date(exp * 1000)
  const now = new Date()
  const isExpired = isAfter(now, expirationDate)

  if (!isExpired) {
    return {
      user: sessionData.user,
      accessToken: sessionData.accessToken,
      headers: new Headers(),
    }
  }

  const { user, headers, accessToken } = await renewSession(
    sessionData,
    session
  )

  if (request.method === 'GET') {
    throw redirect(request.url, { headers })
  }

  return { user, accessToken, headers }
}

export const getAuthenticatedUser = async (
  request: Request
): Promise<User | undefined> => {
  const result = await getAuthentication(request)
  return result ? result.user : undefined
}

export const loaderAuthenticate = async (
  request: Request
): Promise<{
  user: User
  accessToken: string
}> => {
  const result = await getAuthentication(request)
  if (!result) {
    throw redirect('/login')
  }
  return result
}

export const actionAuthenticate = async (
  request: Request
): Promise<{
  user: User
  accessToken: string
  headers: Headers
}> => {
  const result = await getAuthentication(request)
  if (!result) {
    throw redirect('/login')
  }
  return result
}

export const renewUserSession = async (request: Request) => {
  const session = await getSession(request)
  const sessionData = getSessionData(session)
  if (!sessionData) {
    logger.error({}, 'Error renewing session. No data in session')
    throw new Error('Error renewing session. No data in session')
  }

  const { headers } = await renewSession(sessionData, session)

  return headers
}

export const createUserSession = async ({
  request,
  tokens,
  redirectTo,
  rememberMe,
}: CreateUserSession) => {
  const session = await getSession(request)
  const user = getUserFromJwt(tokens.idToken)
  const now = new Date()
  const expires = rememberMe ? addMonths(now, 12) : addDays(now, 2)

  const sessionData = SessionData.safeParse({
    refreshToken: tokens.refreshToken,
    user,
    accessToken: tokens.accessToken,
    cookieExpires: expires.toISOString(),
  })

  if (!sessionData.success) {
    logger.error(sessionData.error, 'Illegal session data')
    throw new Error('Session data corrupted')
  }

  setSessionData(session, sessionData.data)

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    await sessionStorage.commitSession(session, {
      expires,
    })
  )

  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(messageSession, `Tervetuloa ${user.nickname}`)
  headers.append('Set-Cookie', await commitMessageSession(messageSession))

  return redirect(redirectTo, {
    headers,
  })
}

export const logout = async (
  request: Request,
  toastSuccessMessage?: string
) => {
  const headers = new Headers()

  if (toastSuccessMessage !== undefined) {
    const messageSession = await getMessageSession(
      request.headers.get('cookie')
    )
    setSuccessMessage(messageSession, toastSuccessMessage)
    headers.append('Set-Cookie', await commitMessageSession(messageSession))
  }

  const session = await getSession(request)
  headers.append('Set-Cookie', await sessionStorage.destroySession(session))

  return redirect('/login', {
    headers,
  })
}
