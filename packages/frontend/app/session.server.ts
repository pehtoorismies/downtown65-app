import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import jwtDecode from 'jwt-decode'
import { z } from 'zod'
import { User } from '~/domain/user'
import { commitSession } from '~/message.server'

const REFRESH_TOKEN_KEY = 'refreshToken'
const ID_TOKEN_KEY = 'idToken'
const ACCESS_TOKEN_KEY = 'accessToken'

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['super-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const Tokens = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  idToken: z.string(),
})

type Tokens = z.infer<typeof Tokens>

const getSession = (request: Request) => {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

interface CreateUserSession {
  request: Request
  tokens: Tokens
  redirectTo: string
}

const renewTokens = async (refreshToken: string): Promise<Tokens> => {
  // fetch tokens from auth0

  return {
    refreshToken,
    accessToken: '123',
    idToken: '123',
  }
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

const Jwt = z.object({
  exp: z.number(),
})

type ValidSession = {
  hasSession: true
  user: User
  accessToken: string
  headers?: { 'Set-Cookie': string }
}
type NoSession = {
  hasSession: false
}

type SessionReturnValue = ValidSession | NoSession

const getUserFromJwt = (idTokenJWT: string): User => {
  const decoded = jwtDecode(idTokenJWT)
  return User.parse(decoded)
}

export const validateSessionUser = async (
  request: Request
): Promise<SessionReturnValue> => {
  const session = await getSession(request)
  //  - if session is expired these getters return undefined and __session is removed
  // - session token is tampered these getters get undefined
  const tokens = getTokens(session)

  if (tokens === undefined) {
    return {
      hasSession: false,
    }
  }
  try {
    const decoded = jwtDecode(tokens.accessToken)
    const { exp } = Jwt.parse(decoded)
    const isExpired = Date.now() >= exp * 1000

    if (!isExpired) {
      return {
        hasSession: true,
        user: getUserFromJwt(tokens.idToken),
        accessToken: tokens.accessToken,
      }
    }
    const renewed = await renewTokens(tokens.refreshToken)
    session.set(REFRESH_TOKEN_KEY, renewed.refreshToken)
    session.set(ID_TOKEN_KEY, renewed.idToken)
    session.set(ACCESS_TOKEN_KEY, renewed.accessToken)

    return {
      hasSession: true,
      user: getUserFromJwt(renewed.idToken),
      accessToken: renewed.accessToken,
      headers: {
        // TODO: Do something!
        'Set-Cookie': await commitSession(session, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          // maxAge: 20, // 20 seconds
        }),
      },
    }
  } catch (error) {
    console.error(error)
    return {
      hasSession: false,
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
        maxAge: 60 * 60 * 24 * 7, // 7 days
        // maxAge: 20, // 20 seconds
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
