import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { logout } from '~/session.server'

export const action: ActionFunction = async ({ request }) => {
  return logout(request)
}

export const loader: LoaderFunction = async () => {
  return redirect('/login')
}
