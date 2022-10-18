import { createCookie } from '@remix-run/node'

export const accessTokenCookie = createCookie('access-token', {
  secrets: ['super-secret'],
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24, // 1 day,
})
