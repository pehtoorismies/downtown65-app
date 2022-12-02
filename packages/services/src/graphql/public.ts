import type { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import type {
  AuthPayload,
  Event as Dt65Event,
  IdPayload,
  LoginPayload,
  MutationForgotPasswordArgs,
  MutationLoginArgs,
  MutationRefreshTokenArgs,
  MutationSignupArgs,
  QueryEventArgs as QueryEventArguments,
  RefreshPayload,
  SignupPayload,
} from '../appsync.gen'
import { forgotPassword } from './auth/forgot-password'
import { signup } from './auth/signup'
import { getEventById } from './events/get-event-by-id'
import { assertUnreachable } from './support/assert-unreachable'
import { login } from '~/graphql/auth/login'
import { refreshToken } from '~/graphql/auth/refresh-token'

export type Inputs =
  | MutationForgotPasswordArgs
  | MutationLoginArgs
  | MutationRefreshTokenArgs
  | MutationSignupArgs
  | QueryEventArguments

export type Outputs =
  | AuthPayload
  | Dt65Event
  | IdPayload
  | LoginPayload
  | RefreshPayload
  | SignupPayload
  | boolean
  | undefined

const PUBLIC_FIELDS = [
  'event',
  'forgotPassword',
  'login',
  'refreshToken',
  'signup',
] as const

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
      case 'refreshToken': {
        return refreshToken(
          event as AppSyncResolverEvent<MutationRefreshTokenArgs>,
          context,
          callback
        )
      }
    }
    assertUnreachable(field)
  }
}
