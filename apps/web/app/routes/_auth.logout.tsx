import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getDestroySessionHeaders } from '~/session.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const headers = await getDestroySessionHeaders(request, {
    message: 'Uloskirjautuminen onnistui',
    type: 'success',
  })

  return redirect('/login', {
    headers,
  })
}
