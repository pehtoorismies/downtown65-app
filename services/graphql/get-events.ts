import { format } from 'date-fns'
import startOfToday from 'date-fns/startOfToday'
import { getTable } from '../functions/db/table'
import { Event } from './support/event'
import { toLegacyEvent } from './support/legacy-api'

const getExpression = (d: Date) => {
  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd'
  )
  return `DATE#${lt}`
}

export const getEvents = async (): Promise<Event[] | undefined> => {
  const Table = getTable()

  const query = getExpression(startOfToday())

  const results = await Table.Dt65Event.query(`EVENT#FUTURE`, {
    index: 'GSI1',
    gt: query,
  })

  return results.Items.map((item: Event) => toLegacyEvent(item))
}
