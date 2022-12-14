import { z } from 'zod'

export const User = z
  .object({
    nickname: z.string(),
    sub: z.string(),
    picture: z.string(),
  })
  .transform(({ sub, ...rest }) => {
    return {
      ...rest,
      id: sub,
    }
  })

export type User = z.infer<typeof User>
