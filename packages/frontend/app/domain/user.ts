import { z } from 'zod'

export const User = z.object({
  nickname: z.string(),
  sub: z.string(),
  picture: z.string(),
})

export type User = {
  nickname: string
  id: string
  picture: string
}
