import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import jwtDecode from 'jwt-decode'
import { z } from 'zod'
import { User } from '~/domain/user'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import { commitSession } from '~/message.server'

const REFRESH_TOKEN_KEY = 'refreshToken'
const ID_TOKEN_KEY = 'idToken'
const ACCESS_TOKEN_KEY = 'accessToken'

export const Tokens = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  idToken: z.string(),
})

type Tokens = z.infer<typeof Tokens>

const Jwt = z.object({
  exp: z.number(),
})

type ValidSession = {
  valid: true
  user: User
  accessToken: string
  headers: Headers
}

type NoSession = {
  valid: false
}

type SessionValue = ValidSession | NoSession

const SEVEN_DAYS: number = 60 * 60 * 24 * 7

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    // TODO: add proper secret
    secrets: ['super-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})

const getSession = (request: Request) => {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

interface CreateUserSession {
  request: Request
  tokens: Tokens
  redirectTo: string
}

const fetchRenewTokens = async (
  refreshToken: string
): Promise<{
  accessToken: string
  idToken: string
}> => {
  const { refreshToken: rt } = await getGqlSdk().RefreshToken(
    {
      refreshToken,
    },
    getPublicAuthHeaders()
  )

  if (rt.tokens) {
    return {
      accessToken: rt.tokens.accessToken,
      idToken: rt.tokens.idToken,
    }
  }

  throw new Error(rt.refreshError)
}

const getTokens = (session: Session): Tokens | undefined => {
  const idToken = session.get(ID_TOKEN_KEY)
  const accessToken = session.get(ACCESS_TOKEN_KEY)
  const refreshToken = session.get(REFRESH_TOKEN_KEY)

  if (
    idToken === undefined ||
    accessToken === undefined ||
    refreshToken === undefined
  ) {
    return
  }

  return {
    idToken,
    accessToken,
    refreshToken,
  }
}

const getUserFromJwt = (idTokenJWT: string): User => {
  const decoded = jwtDecode(idTokenJWT)
  return User.parse(decoded)
}

export const validateSessionUser = async (
  request: Request
): Promise<SessionValue> => {
  const session = await getSession(request)
  //  - if session is expired these getters return undefined and __session is removed
  // - session token is tampered these getters get undefined
  const tokens = getTokens(session)

  if (tokens === undefined) {
    return {
      valid: false,
    }
  }

  try {
    const decoded = jwtDecode(tokens.accessToken)
    const { exp } = Jwt.parse(decoded)
    const isExpired = Date.now() >= exp * 1000

    if (!isExpired) {
      return {
        valid: true,
        user: getUserFromJwt(tokens.idToken),
        accessToken: tokens.accessToken,
        headers: new Headers(),
      }
    }

    const renewResponse = await fetchRenewTokens(tokens.refreshToken)
    session.set(REFRESH_TOKEN_KEY, tokens.refreshToken)
    session.set(ID_TOKEN_KEY, renewResponse.idToken)
    session.set(ACCESS_TOKEN_KEY, renewResponse.accessToken)

    const renewedSessionCookie = await commitSession(session, {
      maxAge: SEVEN_DAYS,
    })

    const headers = new Headers()
    headers.append('Set-Cookie', renewedSessionCookie)

    return {
      valid: true,
      user: getUserFromJwt(renewResponse.idToken),
      accessToken: renewResponse.accessToken,
      headers,
    }
  } catch (error) {
    console.error(error)
    return {
      valid: false,
    }
  }
}

export const createUserSession = async ({
  request,
  tokens,
  redirectTo,
}: CreateUserSession) => {
  const session = await getSession(request)
  session.set(REFRESH_TOKEN_KEY, tokens.refreshToken)
  session.set(ID_TOKEN_KEY, tokens.idToken)
  session.set(ACCESS_TOKEN_KEY, tokens.accessToken)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: SEVEN_DAYS,
      }),
    },
  })
}

export const logout = async (request: Request) => {
  const session = await getSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

export const publicLogout = async (request: Request, data: unknown) => {
  const session = await getSession(request)
  return json(data, {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
