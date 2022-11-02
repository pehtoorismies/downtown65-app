import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { validateSessionUser } from '~/session.server'

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')
  const result = await validateSessionUser(request)
  if (!result.hasSession) {
    return redirect('/auth/login')
  }
  // const body = await request.formData()
  // const action = body.get('action')

  return json({})
}
