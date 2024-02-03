import type {
  Challenge,
  Event as Dt65Event,
  IdPayload,
  MeUser,
  MutationAddChallengeAccomplishmentArgs,
  MutationCreateChallengeArgs,
  MutationCreateEventArgs,
  MutationDeleteEventArgs,
  MutationLeaveChallengeArgs,
  MutationLeaveEventArgs,
  MutationParticipateChallengeArgs,
  MutationParticipateEventArgs,
  MutationRemoveChallengeAccomplishmentArgs,
  MutationUpdateAvatarArgs,
  MutationUpdateEventArgs,
  MutationUpdateMeArgs,
  OtherUser,
  QueryChallengesArgs,
  QueryEventArgs as QueryEventArguments,
  QueryUserArgs,
  QueryUsersArgs,
  UsersResponse,
} from '@downtown65-app/types'
import type { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import { createEvent } from './events/create-event'
import { deleteEvent } from './events/delete-event'
import { getEvents } from './events/get-events'
import { leaveEvent } from './events/leave-event'
import { participateEvent } from './events/participate-event'
import { updateEvent } from './events/update-event'
import { assertUnreachable } from './support/assert-unreachable'
import type { EmptyArgs } from './support/empty-args'
import { verifyScope } from './support/verify-scope'
import { getMe } from './users/get-me'
import { getUser } from './users/get-user'
import { getUsers } from './users/get-users'
import { updateAvatar } from './users/update-avatar'
import { updateMe } from './users/update-me'
import { addChallengeAccomplishment } from '~/gql/challenges/add-challenge-accomplishment'
import { createChallenge } from '~/gql/challenges/create-challenge'
import { getChallenges } from '~/gql/challenges/get-challenges'
import { leaveChallenge } from '~/gql/challenges/leave-challenge'
import { participateChallenge } from '~/gql/challenges/participate-event'
import { removeChallengeAccomplishment } from '~/gql/challenges/remove-challenge-accomplishment'

export type Inputs =
  | EmptyArgs
  | MutationCreateChallengeArgs
  | MutationCreateEventArgs
  | MutationDeleteEventArgs
  | MutationLeaveChallengeArgs
  | MutationLeaveEventArgs
  | MutationParticipateChallengeArgs
  | MutationParticipateEventArgs
  | MutationUpdateAvatarArgs
  | MutationUpdateEventArgs
  | MutationUpdateMeArgs
  | QueryEventArguments
  | QueryUserArgs
  | QueryUsersArgs
  | QueryChallengesArgs

export type Outputs =
  | Dt65Event
  | Dt65Event[]
  | IdPayload
  | MeUser
  | OtherUser
  | OtherUser[]
  | UsersResponse
  | Challenge[]
  | boolean
  | string
  | undefined

const PRIVATE_FIELDS = [
  'createEvent',
  'deleteEvent',
  'events',
  'leaveEvent',
  'leaveChallenge',
  'me',
  'participateEvent',
  'participateChallenge',
  'updateEvent',
  'updateAvatar',
  'updateMe',
  'users',
  'user',
  'createChallenge',
  'challenges',
  'addChallengeAccomplishment',
  'removeChallengeAccomplishment',
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
      case 'createChallenge': {
        allowScopes(['write:events'])
        return createChallenge(
          event as AppSyncResolverEvent<MutationCreateChallengeArgs>,
          context,
          callback
        )
      }
      case 'leaveChallenge': {
        allowScopes(['write:events'])
        return leaveChallenge(
          event as AppSyncResolverEvent<MutationLeaveChallengeArgs>,
          context,
          callback
        )
      }
      case 'participateChallenge': {
        allowScopes(['write:events'])
        return participateChallenge(
          event as AppSyncResolverEvent<MutationParticipateChallengeArgs>,
          context,
          callback
        )
      }
      case 'challenges': {
        allowScopes(['read:events'])
        return getChallenges(
          event as AppSyncResolverEvent<QueryChallengesArgs>,
          context,
          callback
        )
      }
      case 'addChallengeAccomplishment': {
        allowScopes(['write:events'])
        return addChallengeAccomplishment(
          event as AppSyncResolverEvent<MutationAddChallengeAccomplishmentArgs>,
          context,
          callback
        )
      }
      case 'removeChallengeAccomplishment': {
        allowScopes(['write:events'])
        return removeChallengeAccomplishment(
          event as AppSyncResolverEvent<MutationRemoveChallengeAccomplishmentArgs>,
          context,
          callback
        )
      }
    }
    assertUnreachable(field)
  }
}
