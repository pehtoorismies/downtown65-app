import { AppSyncResolverEvent, AppSyncResolverHandler } from 'aws-lambda'
import { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import {
  QueryEventArgs as QueryEventArguments,
  Event as Dt65Event,
  MutationCreateEventArgs,
  MutationLoginArgs,
  MutationSignupArgs,
  User,
} from '../appsync'
import { createEvent, CreateEventArguments } from './create-event'
import { getEventById } from './get-event-by-id'
import { getEvents } from './get-events'
import { getMe } from './get-me'
import { AuthPayload, login, LoginArguments } from './login'
import { signup, SignupArguments } from './signup'
import { LegacyEvent } from './support/event'

type Identity = {
  identity: {
    claims: {
      sub: string
      aud: string[]
      azp: string
      scope: string
      iss: string
      ['https://graphql.downtown65.com/nickname']: string
      exp: number
      iat: number
      gty: string
    }
    issuer: string
    sub: string
  }
}

// function assertUnreachable(x: never): never {
//   throw new Error(`Didn't expect to get here ${x}`)
// }

export type EmptyArgs = Record<string, never>

type Inputs =
  | MutationCreateEventArgs
  | QueryEventArguments
  | MutationLoginArgs
  | MutationSignupArgs
  | EmptyArgs

type Outputs = Dt65Event | Dt65Event[] | undefined | AuthPayload | User

export const main: AppSyncResolverHandler<Inputs, Outputs> = (
  event,
  context,
  callback
) => {
  switch (event.info.fieldName) {
    case 'findEvent':
    case 'event': {
      return getEventById(
        event as AppSyncResolverEvent<QueryEventArguments>,
        context,
        callback
      )
    }
    case 'events':
    case 'findManyEvents': {
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
  }
}
