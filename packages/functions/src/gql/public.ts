import type {
  Challenge,
  Event as Dt65Event,
  LoginResponse,
  MutationForgotPasswordArgs,
  MutationLoginArgs,
  MutationRefreshTokenArgs,
  MutationSignupArgs,
  QueryChallengeArgs,
  QueryEventArgs,
  RefreshResponse,
  SignupResponse,
} from '@downtown65-app/types'
import type { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import { forgotPassword } from './auth/forgot-password'
import { login } from './auth/login'
import { refreshToken } from './auth/refresh-token'
import { signup } from './auth/signup'
import { getEventById } from './events/get-event-by-id'
import { assertUnreachable } from './support/assert-unreachable'
import { getChallengeById } from '~/gql/challenges/get-challenge-by-id'

export type Inputs =
  | MutationForgotPasswordArgs
  | MutationLoginArgs
  | MutationRefreshTokenArgs
  | MutationSignupArgs
  | QueryEventArgs
  | QueryChallengeArgs

export type Outputs =
  | Dt65Event
  | Challenge
  | LoginResponse
  | RefreshResponse
  | SignupResponse
  | boolean
  | undefined
  | null

const PUBLIC_FIELDS = [
  'challenge',
  'event',
  'forgotPassword',
  'login',
  'refreshToken',
  'signup',
] as const

type PublicField = (typeof PUBLIC_FIELDS)[number]

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
          event as AppSyncResolverEvent<QueryEventArgs>,
          context,
          callback
        )
      }
      case 'challenge': {
        return getChallengeById(
          event as AppSyncResolverEvent<QueryChallengeArgs>,
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
