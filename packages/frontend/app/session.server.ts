import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import jwtDecode from 'jwt-decode'
import { z } from 'zod'
import { User } from '~/domain/user'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import {
  setSuccessMessage,
  getMessageSession,
  commitMessageSession,
} from '~/message.server'

const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'
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

const getValues = (
  session: Session
): { user: User; accessToken: string; refreshToken: string } | undefined => {
  const user = session.get(USER_KEY)
  const accessToken = session.get(ACCESS_TOKEN_KEY)
  const refreshToken = session.get(REFRESH_TOKEN_KEY)

  if (
    user === undefined ||
    accessToken === undefined ||
    refreshToken === undefined
  ) {
    return
  }

  return {
    user: JSON.parse(user),
    accessToken,
    refreshToken,
  }
}

const getUserFromJwt = (idTokenJWT: string): User => {
  const decoded = jwtDecode(idTokenJWT)
  return User.parse(decoded)
}

export const authenticate = async (request: Request): Promise<SessionValue> => {
  const session = await getSession(request)
  //  - if session is expired these getters return undefined and __session is removed
  // - session token is tampered these getters get undefined
  const values = getValues(session)

  if (values === undefined) {
    return {
      valid: false,
    }
  }

  try {
    const decoded = jwtDecode(values.accessToken)
    const { exp } = Jwt.parse(decoded)
    const isExpired = Date.now() >= exp * 1000

    if (!isExpired) {
      return {
        valid: true,
        user: values.user,
        accessToken: values.accessToken,
        headers: new Headers(),
      }
    }

    const renewResponse = await fetchRenewTokens(values.refreshToken)
    const user = getUserFromJwt(renewResponse.idToken)
    session.set(REFRESH_TOKEN_KEY, values.refreshToken)
    session.set(USER_KEY, JSON.stringify(user))
    session.set(ACCESS_TOKEN_KEY, renewResponse.accessToken)

    const renewedSessionCookie = await sessionStorage.commitSession(session, {
      maxAge: SEVEN_DAYS,
    })

    const headers = new Headers()
    headers.append('Set-Cookie', renewedSessionCookie)

    return {
      valid: true,
      user,
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
  const user = getUserFromJwt(tokens.idToken)

  session.set(REFRESH_TOKEN_KEY, tokens.refreshToken)
  session.set(USER_KEY, JSON.stringify(user))
  session.set(ACCESS_TOKEN_KEY, tokens.accessToken)

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    await sessionStorage.commitSession(session, {
      maxAge: SEVEN_DAYS,
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

export const publicLogout = async (request: Request, data: unknown) => {
  const session = await getSession(request)
  return json(data)
  // return json(data, {
  //   headers: {
  //     'Set-Cookie': await sessionStorage.destroySession(session),
  //   },
  // })
}
