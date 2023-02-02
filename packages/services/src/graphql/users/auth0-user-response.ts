import { z } from 'zod'
import type { OtherUser } from '~/appsync.gen'

export const Auth0UserResponse = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
  nickname: z.string(),
  picture: z.string(),
})

type Auth0UserResponse = z.infer<typeof Auth0UserResponse>

export const mapToOtherUser = (user: Auth0UserResponse): OtherUser => {
  return {
    id: user.user_id,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    picture: user.picture,
  }
}
