import { createEvent, CreateEventArguments } from './create-event'
import { EventArguments, getEventById } from './get-event-by-id'
import { getEvents } from './get-events'
import { getMe } from './get-me'
import { AuthPayload, login, LoginArguments } from './login'
import { signup, SignupArguments, User } from './signup'
import { LegacyEvent } from './support/event'

type FieldName =
  | 'event'
  | 'events'
  | 'createEvent'
  | 'findEvent'
  | 'findManyEvents'
  | 'login'
  | 'signup'
  | 'me'

type Arguments = EventArguments &
  CreateEventArguments &
  LoginArguments &
  SignupArguments

interface AppSyncEvent {
  info: {
    fieldName: FieldName
  }
  arguments: Arguments
}

function assertUnreachable(x: never): never {
  throw new Error(`Didn't expect to get here ${x}`)
}

export const main = (
  event: AppSyncEvent
): Promise<LegacyEvent | LegacyEvent[] | AuthPayload | User | undefined> => {
  switch (event.info.fieldName) {
    case 'findEvent': // Legacy query
    case 'event': {
      return getEventById(event.arguments as EventArguments)
    }
    case 'findManyEvents':
    case 'events': {
      // add some filter
      return getEvents()
    }
    case 'createEvent': {
      return createEvent(event.arguments as CreateEventArguments)
    }
    case 'login': {
      console.log(event)
      return login(event.arguments as LoginArguments)
    }
    case 'signup': {
      return signup(event.arguments as SignupArguments)
    }
    case 'me': {
      return getMe()
    }
  }
  return assertUnreachable(event.info.fieldName)
}
