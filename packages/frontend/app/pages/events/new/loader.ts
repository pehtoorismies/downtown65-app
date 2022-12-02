import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { User } from '~/domain/user'
import { logout, validateSessionUser } from '~/session.server'

export interface LoaderData {
  me: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await validateSessionUser(request)

  if (!userSession.valid) {
    return logout(request)
  }

  return json<LoaderData>(
    {
      me: userSession.user,
    },
    { headers: userSession.headers }
  )
}
