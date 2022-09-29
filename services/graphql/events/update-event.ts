import type { AppSyncResolverHandler } from 'aws-lambda'
import formatISO from 'date-fns/formatISO'

import type { Event as Dt65Event, MutationUpdateEventArgs } from '../../appsync'
import { getTable } from '../../functions/db/table'
import { getPrimaryKey } from '../../functions/events/support/event-primary-key'

import { toLegacyEvent } from '../support/legacy-api'

// : EventInput & { GSI1SK?: string }

const getUpdateObject = (input: MutationUpdateEventArgs['input']) => {
  if (input.dateStart) {
    const dateStart = formatISO(new Date(input.dateStart))
    return {
      ...input,
      dateStart,
      GSI1SK: `DATE#${dateStart}#${input.id.slice(0, 8)}`,
    }
  }
  return input
}

export const updateEvent: AppSyncResolverHandler<
  MutationUpdateEventArgs,
  Dt65Event
> = async (event) => {
  const { input } = event.arguments
  if (Object.keys(input).length === 1) {
    // only eventId
    throw new Error('No fields to be updated')
  }

  const updated = getUpdateObject(input)

  const Table = getTable()

  const result = await Table.Dt65Event.update(
    {
      ...getPrimaryKey(input.id),
      ...updated,
    },
    {
      returnValues: 'all_new',
    }
  )

  return toLegacyEvent(result.Item)
}
