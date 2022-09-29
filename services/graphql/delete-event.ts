import { AppSyncResolverHandler } from 'aws-lambda'
import { MutationDeleteEventArgs, IdPayload } from '../appsync'
import { getTable } from '../functions/db/table'
import { getPrimaryKey } from '../functions/events/support/event-primary-key'

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
