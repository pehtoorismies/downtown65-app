import { assertUnreachable } from '@downtown65-app/util/assert-unreachable'
import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { addDays, addMonths, isAfter, parseISO } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import { Config } from 'sst/node/config'
import { z } from 'zod'
import { User } from '~/domain/user'
import { graphql } from '~/generated/gql'
import { RefreshTokenDocument } from '~/generated/graphql'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import type { ToastMessage } from '~/message.server'
import {
  commitMessageSession,
  getMessageSession,
  setMessage,
} from '~/message.server'
import {
  CookieSessionData,
  getCookieSessionData,
  setCookieSessionData,
} from '~/util/cookie-session-data'
import { logger } from '~/util/logger.server'

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

const getUserFromJwt = (idTokenJWT: string): User => {
  const decoded = jwtDecode(idTokenJWT)
  return User.parse({
    ...decoded,
    id: decoded.sub,
  })
}

export const getDestroySessionHeaders = async (
  request: Request,
  message: ToastMessage
) => {
  const headers = new Headers()
  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setMessage(messageSession, message)
  headers.append('Set-Cookie', await commitMessageSession(messageSession))

  const session = await getSession(request)
  headers.append('Set-Cookie', await sessionStorage.destroySession(session))
  return headers
}

const renewSession = async (
  oldSessionData: CookieSessionData,
  session: Session,
  request: Request
) => {
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

      const sessionData = CookieSessionData.parse({
        refreshToken: oldSessionData.refreshToken,
        user,
        accessToken: result.accessToken,
        cookieExpires: oldSessionData.cookieExpires,
      })

      setCookieSessionData(session, sessionData)
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
      const headers = await getDestroySessionHeaders(request, {
        message: 'Session uusiminen epäonnistui.',
        type: 'error',
      })
      throw redirect('/login', { headers })
    }
  }

  // make sure switch case is exhaustive
  const { __typename } = result
  assertUnreachable(__typename)
}

interface AuthenticationResponse {
  user: User
  accessToken: string
  headers: Headers
}

const getAuthentication = async (
  request: Request
): Promise<AuthenticationResponse | undefined> => {
  const session = await getSession(request)
  const sessionData = getCookieSessionData(session)
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
    session,
    request
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
    const headers = await getDestroySessionHeaders(request, {
      message: 'Sessio vanhentunut',
      type: 'error',
    })
    throw redirect('/login', { headers })
  }
  return result
}

export const actionAuthenticate = async (
  request: Request
): Promise<AuthenticationResponse> => {
  const result = await getAuthentication(request)
  if (!result) {
    const headers = await getDestroySessionHeaders(request, {
      message: 'Sessio vanhentunut',
      type: 'error',
    })

    throw redirect('/login', { headers })
  }
  return result
}

export const renewUserSession = async (request: Request) => {
  const session = await getSession(request)
  const sessionData = getCookieSessionData(session)
  if (!sessionData) {
    logger.error({}, 'Error renewing session. No data in session')
    throw new Error('Error renewing session. No data in session')
  }

  const { headers } = await renewSession(sessionData, session, request)

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

  const sessionData = CookieSessionData.safeParse({
    refreshToken: tokens.refreshToken,
    user,
    accessToken: tokens.accessToken,
    cookieExpires: expires.toISOString(),
  })

  if (!sessionData.success) {
    logger.error(sessionData.error, 'Illegal session data')
    throw new Error('Session data corrupted')
  }

  setCookieSessionData(session, sessionData.data)

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    await sessionStorage.commitSession(session, {
      expires,
    })
  )

  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setMessage(messageSession, {
    message: `Tervetuloa ${user.nickname}`,
    type: 'success',
  })
  headers.append('Set-Cookie', await commitMessageSession(messageSession))

  return redirect(redirectTo, {
    headers,
  })
}
