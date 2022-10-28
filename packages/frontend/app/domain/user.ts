import jwtDecode from 'jwt-decode'
import { z } from 'zod'

const User = z.object({
  nickname: z.string(),
  sub: z.string(),
  picture: z.string(),
})

export type User = {
  nickname: string
  id: string
  picture: string
}

export const userFromIdToken = (idToken: string): User | undefined => {
  try {
    const decoded = jwtDecode(idToken)
    const response = User.safeParse(decoded)
    return response.success
      ? {
          ...response.data,
          id: response.data.sub,
        }
      : undefined
  } catch {
    return undefined
  }
}
