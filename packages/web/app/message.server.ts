import type { Session } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'
import { Config } from 'sst/node/config'

export type ToastMessage = { message: string; type: 'success' | 'error' }

const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    name: '__message',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    // expires: new Date(Date.now() + ONE_YEAR),
    secrets: [Config.COOKIE_SECRET],
    secure: true,
  },
})

export const setSuccessMessage = (session: Session, message: string) => {
  session.flash('toastMessage', { message, type: 'success' } as ToastMessage)
}

// export const setErrorMessage = (session: Session, message: string) => {
//   session.flash('toastMessage', { message, type: 'error' } as ToastMessage)
// }

export {
  commitSession as commitMessageSession,
  getSession as getMessageSession,
}
