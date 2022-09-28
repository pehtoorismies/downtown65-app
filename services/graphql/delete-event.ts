import { AppSyncResolverHandler } from 'aws-lambda'
import {
  QueryEventArgs as QueryEventArguments,
  Event as Dt65Event,
  MutationDeleteEventArgs,
  IdPayload,
} from '../appsync'
import { getTable } from '../functions/db/table'
import { getPrimaryKey } from '../functions/events/support/event-primary-key'

import {
  badRequestResponse,
  successResponse,
} from '../functions/support/response'
import { toLegacyEvent } from './support/legacy-api'

export const deleteEvent: AppSyncResolverHandler<
  MutationDeleteEventArgs,
  IdPayload
> = async (event) => {
  const Table = getTable()

  const results = await Table.Dt65Event.delete(
    getPrimaryKey(event.arguments.eventId),
    {
      returnValues: 'ALL_OLD',
    }
  )

  if (!results.Attributes) {
    throw new Error('Event not found')
  }

  return {
    id: event.arguments.eventId,
  }
}
