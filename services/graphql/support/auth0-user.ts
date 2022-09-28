import { z } from 'zod'

export const Auth0UserResponse = z.object({
  user_id: z.string(),
  email: z.string(),
  name: z.string(),
  nickname: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  user_metadata: z.object({
    subscribeWeeklyEmail: z.boolean(),
    subscribeEventCreationEmail: z.boolean(),
  }),
})

type Auth0UserResponse = z.infer<typeof Auth0UserResponse>

export const toUser = (auth0User: Auth0UserResponse) => {
  return {
    id: auth0User.user_id,
    email: auth0User.email,
    name: auth0User.name,
    nickname: auth0User.nickname,
    updatedAt: auth0User.updated_at,
    createdAt: auth0User.created_at,
    preferences: auth0User.user_metadata,
  }
}
