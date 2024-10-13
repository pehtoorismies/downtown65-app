import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Event from '../../core/event'
import type {
  IdPayload,
  MutationCreateEventArgs,
} from '~/generated-types/graphql-types'

export const createEvent: AppSyncResolverHandler<
  MutationCreateEventArgs,
  IdPayload
> = async (event) => {
  const { input: creatableEvent } = event.arguments

  const id = await Event.create(creatableEvent)
  return {
    __typename: 'IDPayload',
    id,
  }
}
