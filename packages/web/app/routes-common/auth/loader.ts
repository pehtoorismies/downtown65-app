import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getAuthenticatedUser } from '~/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser(request)
  return user ? redirect('/events') : json({})
}
