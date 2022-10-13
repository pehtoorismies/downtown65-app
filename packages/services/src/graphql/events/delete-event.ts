import type { AppSyncResolverHandler } from 'aws-lambda'
import { getPrimaryKey } from './support/event-primary-key'
import type { IdPayload, MutationDeleteEventArgs } from '~/appsync'
import { getTable } from '~/dynamo/table'

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
