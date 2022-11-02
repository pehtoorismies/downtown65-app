import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { validateSessionUser } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (result.hasSession) {
    const headers = result.headers ?? {}
    return redirect('/events', { headers })
  } else {
    return json({})
  }
}
