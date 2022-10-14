import type { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import type {
  AuthPayload,
  Event as Dt65Event,
  IdPayload,
  LoginPayload,
  MutationForgotPasswordArgs,
  MutationLoginArgs,
  MutationSignupArgs,
  QueryEventArgs as QueryEventArguments,
  User,
} from '../appsync.gen'
import { forgotPassword } from './auth/forgot-password'
import { login } from './auth/login'
import { signup } from './auth/signup'
import { getEventById } from './events/get-event-by-id'
import { assertUnreachable } from './support/assert-unreachable'

export type Inputs =
  | MutationForgotPasswordArgs
  | MutationLoginArgs
  | MutationSignupArgs
  | QueryEventArguments

export type Outputs =
  | AuthPayload
  | LoginPayload
  | Dt65Event
  | IdPayload
  | User
  | boolean
  | undefined

const PUBLIC_FIELDS = ['event', 'login', 'signup', 'forgotPassword'] as const
type PublicField = typeof PUBLIC_FIELDS[number]

export const isPublicField = (s: string): s is PublicField => {
  return PUBLIC_FIELDS.includes(s as PublicField)
}

export const publicResolver = (
  field: PublicField
): AppSyncResolverHandler<Inputs, Outputs> => {
  return (event, context, callback) => {
    switch (field) {
      case 'event': {
        return getEventById(
          event as AppSyncResolverEvent<QueryEventArguments>,
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
      case 'forgotPassword': {
        return forgotPassword(
          event as AppSyncResolverEvent<MutationForgotPasswordArgs>,
          context,
          callback
        )
      }
    }
    assertUnreachable(field)
  }
}
