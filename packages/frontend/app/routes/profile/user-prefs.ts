import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { userPrefsCookie } from './modules/user-prefs-cookie'

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefsCookie.parse(cookieHeader)) || {}
  const bodyParams = await request.formData()

  if (bodyParams.get('showGravatarTip') === 'hidden') {
    cookie.showGravatarTip = false
  }
  // TODO: get from request?
  return redirect('/profile', {
    headers: {
      'Set-Cookie': await userPrefsCookie.serialize(cookie),
    },
  })
}
