import type { AppSyncResolverHandler } from 'aws-lambda'
import { getPrimaryKey } from './support/event-primary-key'
import type {
  Event as Dt65Event,
  QueryEventArgs as QueryEventArguments,
} from '~/appsync.gen'
import { getTable } from '~/dynamo/table'

export const getEventById: AppSyncResolverHandler<
  QueryEventArguments,
  Dt65Event | undefined
> = async (event) => {
  const Table = getTable()
  const result = await Table.Dt65Event.get(
    getPrimaryKey(event.arguments.eventId)
  )
  return result.Item
}
