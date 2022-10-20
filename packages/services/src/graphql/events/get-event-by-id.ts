import type { AppSyncResolverHandler } from 'aws-lambda'
import { getPrimaryKey } from '../../core/event-primary-key'
import type {
  Event as Dt65Event,
  QueryEventArgs as QueryEventArguments,
} from '~/appsync.gen'
import { mapDynamoToEvent } from '~/core/map-dynamo-to-event'
import { getTable } from '~/dynamo/table'

export const getEventById: AppSyncResolverHandler<
  QueryEventArguments,
  Dt65Event | undefined
> = async (event) => {
  const Table = getTable()
  const result = await Table.Dt65Event.get(
    getPrimaryKey(event.arguments.eventId)
  )
  if (!result.Item) {
    return
  }

  return mapDynamoToEvent(result.Item)
}
