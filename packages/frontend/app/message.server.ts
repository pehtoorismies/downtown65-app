import type { Session } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'
import { getCookieSecret } from '~/cookie-secret.server'

export type ToastMessage = { message: string; type: 'success' | 'error' }

const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    name: '__message',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    // expires: new Date(Date.now() + ONE_YEAR),
    secrets: [getCookieSecret()],
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
