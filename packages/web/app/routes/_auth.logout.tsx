import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { logout } from '~/session.server'

export const action = ({ request }: ActionFunctionArgs) => {
  return logout(request, 'Uloskirjautuminen onnistui')
}

export const loader = () => {
  return redirect('/login')
}
