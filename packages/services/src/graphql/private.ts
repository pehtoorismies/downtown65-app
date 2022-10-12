import type { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import type {
  BaseUser,
  Event as Dt65Event,
  IdPayload,
  MutationCreateEventArgs,
  MutationDeleteEventArgs,
  MutationJoinEventArgs,
  MutationLeaveEventArgs,
  MutationUpdateEventArgs,
  QueryEventArgs as QueryEventArguments,
  User,
} from '../../appsync'
import type { EmptyArgs } from '../../functions/gql/gql'
import { createEvent } from './events/create-event'
import { deleteEvent } from './events/delete-event'
import { getEvents } from './events/get-events'
import { joinEvent } from './events/join-event'
import { leaveEvent } from './events/leave-event'
import { updateEvent } from './events/update-event'
import { assertUnreachable } from './support/assert-unreachable'
import { verifyScope } from './support/verify-scope'
import { getMe } from './users/get-me'
import { getUsers } from './users/get-users'

export type Inputs =
  | EmptyArgs
  | MutationCreateEventArgs
  | MutationDeleteEventArgs
  | MutationUpdateEventArgs
  | QueryEventArguments

export type Outputs =
  | BaseUser[]
  | Dt65Event
  | Dt65Event[]
  | IdPayload
  | User
  | undefined

const PRIVATE_FIELDS = [
  'events',
  'createEvent',
  'updateEvent',
  'deleteEvent',
  'joinEvent',
  'leaveEvent',
  'me',
  'users',
] as const
type PrivateField = typeof PRIVATE_FIELDS[number]

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
      case 'joinEvent': {
        allowScopes(['write:events'])
        return joinEvent(
          event as AppSyncResolverEvent<MutationJoinEventArgs>,
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
      case 'users': {
        allowScopes(['read:users'])
        return getUsers(
          event as AppSyncResolverEvent<EmptyArgs>,
          context,
          callback
        )
      }
    }
    assertUnreachable(field)
  }
}
