import { z } from 'zod'
import type { BaseUser, User } from '~/appsync.gen'

const ROLES = ['USER', 'ADMIN'] as const

export const Auth0UserResponse = z.object({
  user_id: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  name: z.string(),
  nickname: z.string(),
  picture: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  user_metadata: z.object({
    subscribeWeeklyEmail: z.boolean(),
    subscribeEventCreationEmail: z.boolean(),
  }),
  app_metadata: z.object({ role: z.enum(ROLES) }),
})

type Auth0UserResponse = z.infer<typeof Auth0UserResponse>

export const toUser = (auth0User: Auth0UserResponse): User => {
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

export const toBaseUser = (auth0User: Auth0UserResponse): BaseUser => {
  return {
    id: auth0User.user_id,
    email: auth0User.email,
    name: auth0User.name,
    nickname: auth0User.nickname,
    picture: auth0User.picture,
  }
}
