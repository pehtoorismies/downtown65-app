import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getAuthenticatedUser } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getAuthenticatedUser(request)
  return user ? redirect('/events') : json({})
}
