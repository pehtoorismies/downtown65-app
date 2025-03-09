import type { MeUser, OtherUser } from '@downtown65-app/types'
import type { GetUsers200ResponseOneOfInner } from 'auth0'
import { z } from 'zod'

const ROLES = ['USER', 'ADMIN'] as const

const Auth0UserResponse = z.object({
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

export const parseAuth0UserResponse = (user: GetUsers200ResponseOneOfInner) => {
  return Auth0UserResponse.parse(user)
}

export const toUser = (auth0User: Auth0UserResponse): MeUser => {
  return {
    __typename: 'MeUser',
    id: auth0User.user_id,
    email: auth0User.email,
    name: auth0User.name,
    nickname: auth0User.nickname,
    picture: auth0User.picture,
    // updatedAt: auth0User.updated_at,
    // createdAt: auth0User.created_at,
    preferences: {
      __typename: 'Preferences',
      ...auth0User.user_metadata,
    },
  }
}

export const mapToOtherUser = (
  user: GetUsers200ResponseOneOfInner,
): OtherUser => {
  if (typeof user.created_at !== 'string') {
    throw new TypeError('Missing created_at property')
  }

  return {
    __typename: 'OtherUser',
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
