import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { validateSessionUser } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await validateSessionUser(request)

  return userSession.valid
    ? redirect('/events', { headers: userSession.headers })
    : json({})
}
