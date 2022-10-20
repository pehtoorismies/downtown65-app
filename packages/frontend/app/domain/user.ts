import jwtDecode from 'jwt-decode'
import { z } from 'zod'

export const User = z.object({
  id: z.string(),
  nickname: z.string(),
  // name: z.string(),
  picture: z.string(),
})

export type User = z.infer<typeof User>

export const userFromIdToken = (idToken: string): User | undefined => {
  try {
    const decoded = jwtDecode(idToken)
    const response = User.safeParse(decoded)
    return response.success ? response.data : undefined
  } catch {
    return undefined
  }
}
