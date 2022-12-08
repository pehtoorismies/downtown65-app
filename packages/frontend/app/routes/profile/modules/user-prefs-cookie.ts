import { createCookie } from '@remix-run/node'

export const userPrefsCookie = createCookie('user-prefs', {
  maxAge: 604_800, // TODO: use proper values
})
