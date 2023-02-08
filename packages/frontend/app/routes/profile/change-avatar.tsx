import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { PrivateRoute } from '~/domain/private-route'
import { loaderAuthenticate } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const { user } = await loaderAuthenticate(request)

  return json<PrivateRoute>({ user })
}

export default function ChangeAvatar() {
  return <h1>avatar</h1>
}
