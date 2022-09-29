import type { AppSyncResolverHandler } from 'aws-lambda'
import type {
  QueryEventArgs as QueryEventArguments,
  Event as Dt65Event,
} from '../../appsync'
import { getTable } from '../../db/table'
import { toLegacyEvent } from '../support/legacy-api'
import { getPrimaryKey } from './support/event-primary-key'

export const getEventById: AppSyncResolverHandler<
  QueryEventArguments,
  Dt65Event | undefined
> = async (event) => {
  const Table = getTable()
  const result = await Table.Dt65Event.get(
    getPrimaryKey(event.arguments.eventId)
  )
  return result.Item ? toLegacyEvent(result.Item) : undefined
}
