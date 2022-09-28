import { AppSyncResolverHandler } from 'aws-lambda'
import {
  QueryEventArgs as QueryEventArguments,
  Event as Dt65Event,
} from '../appsync'
import { getTable } from '../functions/db/table'
import { getPrimaryKey } from '../functions/events/support/event-primary-key'

import { toLegacyEvent } from './support/legacy-api'

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
