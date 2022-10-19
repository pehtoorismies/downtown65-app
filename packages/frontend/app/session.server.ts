import { createCookieSessionStorage, redirect } from '@remix-run/node'

const AUTH_TOKEN_KEY = 'authToken'
const NICK_KEY = 'nick'

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

const getSession = (request: Request) => {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export const getJwtFromSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie')
  const value = await sessionStorage.getSession(cookie)
  return value.get(AUTH_TOKEN_KEY)
}

export const createUserSession = async ({
  request,
  authToken,
  nickname,
  redirectTo,
}: {
  request: Request
  authToken: string
  nickname: string
  redirectTo: string
}) => {
  const session = await getSession(request)
  session.set(AUTH_TOKEN_KEY, authToken)
  session.set(NICK_KEY, nickname)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7,
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
