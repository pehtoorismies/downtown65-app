import type {
  IdPayload,
  MutationCreateEventArgs,
} from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../core/event'

export const createEvent: AppSyncResolverHandler<
  MutationCreateEventArgs,
  IdPayload
> = async (event) => {
  const { input: creatableEvent } = event.arguments

  const { id } = await Event.create({
    ...creatableEvent,
    type: creatableEvent.type,
  })

  return {
    id,
  }
}