import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { logout, getUserSession } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request)

  return !session.valid
    ? logout(request)
    : redirect('/events', { headers: session.headers })
}
