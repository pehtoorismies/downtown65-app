export type Claims = {
  sub: string
  aud: string[]
  azp: string
  scope: string
  iss: string
  exp: number
  iat: number
  gty: string
}
