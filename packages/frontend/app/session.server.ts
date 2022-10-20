import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { z } from 'zod'
import type { User } from '~/domain/user'
import { userFromIdToken } from '~/domain/user'

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

type TokensType = z.infer<typeof Tokens>

const getSession = (request: Request) => {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export const getJwtFromSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie')
  const value = await sessionStorage.getSession(cookie)
  return value.get(REFRESH_TOKEN_KEY)
}

interface CreateUserSession {
  request: Request
  tokens: TokensType
  redirectTo: string
}

export const getUser = async (request: Request): Promise<User | undefined> => {
  const session = await getSession(request)
  return userFromIdToken(session.get(ID_TOKEN_KEY))
}

export const getAccessToken = async (
  request: Request
): Promise<string | undefined> => {
  const session = await getSession(request)
  return session.get(ACCESS_TOKEN_KEY)
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
      }),
    },
  })
}

export const logout = async (request: Request) => {
  const session = await getSession(request)
  return redirect('/auth/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
