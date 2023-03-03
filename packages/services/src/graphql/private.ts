import type { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import type {
  Event as Dt65Event,
  IdPayload,
  MeUser,
  MutationCreateEventArgs,
  MutationDeleteEventArgs,
  MutationLeaveEventArgs,
  MutationParticipateEventArgs,
  MutationUpdateAvatarArgs,
  MutationUpdateEventArgs,
  MutationUpdateMeArgs,
  OtherUser,
  QueryEventArgs as QueryEventArguments,
  QueryUserArgs,
  QueryUsersArgs,
  UsersResponse,
} from '../appsync.gen'
import { createEvent } from './events/create-event'
import { deleteEvent } from './events/delete-event'
import { getEvents } from './events/get-events'
import { leaveEvent } from './events/leave-event'
import { updateEvent } from './events/update-event'
import { assertUnreachable } from './support/assert-unreachable'
import { verifyScope } from './support/verify-scope'
import { getMe } from './users/get-me'
import { getUser } from './users/get-user'
import { getUsers } from './users/get-users'
import { participateEvent } from '~/graphql/events/participate-event'
import type { EmptyArgs } from '~/graphql/support/empty-args'
import { updateAvatar } from '~/graphql/users/update-avatar'
import { updateMe } from '~/graphql/users/update-me'

export type Inputs =
  | EmptyArgs
  | MutationCreateEventArgs
  | MutationDeleteEventArgs
  | MutationUpdateAvatarArgs
  | MutationUpdateEventArgs
  | MutationUpdateMeArgs
  | QueryEventArguments
  | QueryUserArgs
  | QueryUsersArgs

export type Outputs =
  | Dt65Event
  | Dt65Event[]
  | IdPayload
  | MeUser
  | OtherUser
  | OtherUser[]
  | UsersResponse
  | boolean
  | string
  | undefined

const PRIVATE_FIELDS = [
  'createEvent',
  'deleteEvent',
  'events',
  'leaveEvent',
  'me',
  'participateEvent',
  'updateEvent',
  'updateAvatar',
  'updateMe',
  'users',
  'user',
] as const
type PrivateField = (typeof PRIVATE_FIELDS)[number]

export const isPrivateField = (s: string): s is PrivateField => {
  return PRIVATE_FIELDS.includes(s as PrivateField)
}

export const privateResolver = (
  field: PrivateField
): AppSyncResolverHandler<Inputs, Outputs> => {
  return (event, context, callback) => {
    const allowScopes = verifyScope(event.identity)

    switch (field) {
      case 'events': {
        allowScopes(['read:events'])
        return getEvents(
          event as AppSyncResolverEvent<Record<string, never>>,
          context,
          callback
        )
      }
      case 'createEvent': {
        allowScopes(['write:events'])
        return createEvent(
          event as AppSyncResolverEvent<MutationCreateEventArgs>,
          context,
          callback
        )
      }
      case 'updateEvent': {
        allowScopes(['write:events'])
        return updateEvent(
          event as AppSyncResolverEvent<MutationUpdateEventArgs>,
          context,
          callback
        )
      }
      case 'deleteEvent': {
        allowScopes(['write:events'])
        return deleteEvent(
          event as AppSyncResolverEvent<MutationDeleteEventArgs>,
          context,
          callback
        )
      }
      case 'leaveEvent': {
        allowScopes(['write:events'])
        return leaveEvent(
          event as AppSyncResolverEvent<MutationLeaveEventArgs>,
          context,
          callback
        )
      }
      case 'participateEvent': {
        allowScopes(['write:events'])
        return participateEvent(
          event as AppSyncResolverEvent<MutationParticipateEventArgs>,
          context,
          callback
        )
      }
      case 'me': {
        allowScopes(['read:me'])
        return getMe(
          event as AppSyncResolverEvent<EmptyArgs>,
          context,
          callback
        )
      }
      case 'user': {
        allowScopes(['read:users'])
        return getUser(
          event as AppSyncResolverEvent<QueryUserArgs>,
          context,
          callback
        )
      }
      case 'users': {
        allowScopes(['read:users'])
        return getUsers(
          event as AppSyncResolverEvent<QueryUsersArgs>,
          context,
          callback
        )
      }
      case 'updateMe': {
        allowScopes(['write:me'])
        return updateMe(
          event as AppSyncResolverEvent<MutationUpdateMeArgs>,
          context,
          callback
        )
      }
      case 'updateAvatar': {
        allowScopes(['write:me'])
        return updateAvatar(
          event as AppSyncResolverEvent<MutationUpdateAvatarArgs>,
          context,
          callback
        )
      }
    }
    assertUnreachable(field)
  }
}
