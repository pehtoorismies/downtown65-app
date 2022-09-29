import type { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import type {
  QueryEventArgs as QueryEventArguments,
  Event as Dt65Event,
  MutationCreateEventArgs,
  MutationLoginArgs,
  MutationSignupArgs,
  User,
  MutationForgotPasswordArgs,
  AuthPayload,
  BaseUser,
  MutationDeleteEventArgs,
  IdPayload,
  MutationLeaveEventArgs,
  MutationJoinEventArgs,
  MutationUpdateEventArgs,
} from '../appsync'
import { forgotPassword } from './auth/forgot-password'
import { login } from './auth/login'
import { signup } from './auth/signup'
import { createEvent } from './events/create-event'
import { deleteEvent } from './events/delete-event'
import { getEventById } from './events/get-event-by-id'
import { getEvents } from './events/get-events'
import { joinEvent } from './events/join-event'
import { leaveEvent } from './events/leave-event'
import { updateEvent } from './events/update-event'
import { getMe } from './users/get-me'
import { getUsers } from './users/get-users'

export type EmptyArgs = Record<string, never>

type Inputs =
  | EmptyArgs
  | MutationCreateEventArgs
  | MutationDeleteEventArgs
  | MutationForgotPasswordArgs
  | MutationLoginArgs
  | MutationSignupArgs
  | MutationUpdateEventArgs
  | QueryEventArguments

type Outputs =
  | AuthPayload
  | BaseUser[]
  | Dt65Event
  | Dt65Event[]
  | IdPayload
  | User
  | boolean
  | undefined

export const main: AppSyncResolverHandler<Inputs, Outputs> = (
  event,
  context,
  callback
) => {
  switch (event.info.fieldName) {
    case 'event': {
      return getEventById(
        event as AppSyncResolverEvent<QueryEventArguments>,
        context,
        callback
      )
    }
    case 'events': {
      return getEvents(
        event as AppSyncResolverEvent<Record<string, never>>,
        context,
        callback
      )
    }
    case 'createEvent': {
      return createEvent(
        event as AppSyncResolverEvent<MutationCreateEventArgs>,
        context,
        callback
      )
    }
    case 'updateEvent': {
      return updateEvent(
        event as AppSyncResolverEvent<MutationUpdateEventArgs>,
        context,
        callback
      )
    }
    case 'deleteEvent': {
      return deleteEvent(
        event as AppSyncResolverEvent<MutationDeleteEventArgs>,
        context,
        callback
      )
    }
    case 'leaveEvent': {
      return leaveEvent(
        event as AppSyncResolverEvent<MutationLeaveEventArgs>,
        context,
        callback
      )
    }
    case 'joinEvent': {
      return joinEvent(
        event as AppSyncResolverEvent<MutationJoinEventArgs>,
        context,
        callback
      )
    }
    case 'login': {
      return login(
        event as AppSyncResolverEvent<MutationLoginArgs>,
        context,
        callback
      )
    }
    case 'signup': {
      return signup(
        event as AppSyncResolverEvent<MutationSignupArgs>,
        context,
        callback
      )
    }
    case 'me': {
      return getMe(event as AppSyncResolverEvent<EmptyArgs>, context, callback)
    }
    case 'forgotPassword': {
      return forgotPassword(
        event as AppSyncResolverEvent<MutationForgotPasswordArgs>,
        context,
        callback
      )
    }
    case 'users': {
      return getUsers(
        event as AppSyncResolverEvent<EmptyArgs>,
        context,
        callback
      )
    }
  }
  throw new Error('Mismatch in schema and implementation')
}
