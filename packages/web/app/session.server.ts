import { assertUnreachable } from '@downtown65-app/core/assert-unreachable'
import { graphql } from '@downtown65-app/graphql/gql'
import { RefreshTokenDocument } from '@downtown65-app/graphql/graphql'
import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import jwtDecode from 'jwt-decode'
import { z } from 'zod'
import { getCookieSecret } from '~/cookie-secret.server'
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

export const Tokens = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  idToken: z.string(),
})

type Tokens = z.infer<typeof Tokens>

const Jwt = z.object({
  exp: z.number(),
})

const TWO_DAYS: number = 60 * 60 * 24 * 2
const ONE_YEAR: number = 60 * 60 * 24 * 365

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [getCookieSecret()],
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

const GglDocumentIgnored = graphql(`
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
    message
  }
`)

const fetchRenewTokens = async (
  refreshToken: string
): Promise<{
  accessToken: string
  idToken: string
}> => {
  const { refreshToken: result } = await gqlClient.request(
    RefreshTokenDocument,
    {
      refreshToken,
    },
    PUBLIC_AUTH_HEADERS
  )

  switch (result.__typename) {
    case 'RefreshTokens': {
      return result
    }
    case 'RefreshError': {
      logger.error({ result }, 'Error refreshing token')
      // TODO: perhaps a softer approach?
      throw new Error(result.message)
    }
  }

  // make sure switch case is exhaustive
  const { __typename } = result
  assertUnreachable(__typename)
}

type Values = {
  user: User
  accessToken: string
  refreshToken: string
}

const getValues = (session: Session): Values | undefined => {
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

const renewSession = async (refreshToken: string, session: Session) => {
  const renewResponse = await fetchRenewTokens(refreshToken)
  const user = getUserFromJwt(renewResponse.idToken)
  session.set(REFRESH_TOKEN_KEY, refreshToken)
  session.set(USER_KEY, JSON.stringify(user))
  session.set(ACCESS_TOKEN_KEY, renewResponse.accessToken)
  const headers = new Headers()
  headers.append('Set-Cookie', await sessionStorage.commitSession(session))
  return { headers, user, accessToken: renewResponse.accessToken }
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
  const values = getValues(session)
  if (!values) {
    return
  }

  const decoded = jwtDecode(values.accessToken)
  const { exp } = Jwt.parse(decoded)
  const isExpired = Date.now() >= exp * 1000

  if (!isExpired) {
    return {
      user: values.user,
      accessToken: values.accessToken,
      headers: new Headers(),
    }
  }

  const { user, headers, accessToken } = await renewSession(
    values.refreshToken,
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
  const values = getValues(session)
  if (!values) {
    throw new Error('Error renewing session. No data in session')
  }

  const { headers } = await renewSession(values.refreshToken, session)

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

  session.set(REFRESH_TOKEN_KEY, tokens.refreshToken)
  session.set(USER_KEY, JSON.stringify(user))
  session.set(ACCESS_TOKEN_KEY, tokens.accessToken)

  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    await sessionStorage.commitSession(session, {
      maxAge: rememberMe ? ONE_YEAR : TWO_DAYS,
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
