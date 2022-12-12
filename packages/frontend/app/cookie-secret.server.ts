export const getCookieSecret = (): string => {
  const cookieSecret = process.env['COOKIE_SECRET']
  if (!cookieSecret) {
    throw new Error(`Environment value 'process.env.COOKIE_SECRET' is not set`)
  }
  return cookieSecret
}
