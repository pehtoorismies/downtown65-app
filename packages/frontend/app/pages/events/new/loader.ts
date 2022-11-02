import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import type { User } from '~/domain/user'
import { validateSessionUser } from '~/session.server'

export interface LoaderData {
  me: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/login')
  }

  const headers = result.headers ?? {}

  return json<LoaderData>(
    {
      me: result.user,
    },
    { headers }
  )
}
