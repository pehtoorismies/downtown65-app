import { z } from 'zod'
import type { MeUser, OtherUser } from '~/appsync.gen'

const ROLES = ['USER', 'ADMIN'] as const

export const Auth0UserResponse = z.object({
  user_id: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  name: z.string(),
  nickname: z.string(),
  picture: z.string(),
  // updated_at: z.string(),
  // created_at: z.string(),
  user_metadata: z.object({
    subscribeWeeklyEmail: z.boolean(),
    subscribeEventCreationEmail: z.boolean(),
  }),
  app_metadata: z.object({ role: z.enum(ROLES) }),
})

type Auth0UserResponse = z.infer<typeof Auth0UserResponse>

export const toUser = (auth0User: Auth0UserResponse): MeUser => {
  return {
    id: auth0User.user_id,
    email: auth0User.email,
    name: auth0User.name,
    nickname: auth0User.nickname,
    picture: auth0User.picture,
    // updatedAt: auth0User.updated_at,
    // createdAt: auth0User.created_at,
    preferences: auth0User.user_metadata,
  }
}

export const Auth0QueryUsersResponse = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
  nickname: z.string(),
  picture: z.string(),
  created_at: z.string(),
})

type Auth0QueryUsersResponse = z.infer<typeof Auth0QueryUsersResponse>

export const mapToOtherUser = (user: Auth0QueryUsersResponse): OtherUser => {
  return {
    id: user.user_id,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    picture: user.picture,
    createdAt: user.created_at,
  }
}

export const QUERY_USER_RETURNED_FIELDS = [
  'nickname',
  'name',
  'user_id',
  'picture',
  'email',
  'created_at',
].join(',')
