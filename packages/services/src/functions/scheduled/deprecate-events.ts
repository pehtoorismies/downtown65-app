import { format } from 'date-fns'
import startOfToday from 'date-fns/startOfToday'
import { getTable } from '~/dynamo/table'

export const main = async () => {
  const Table = getTable()

  const d = startOfToday()

  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd'
  )

  await Table.Dt65Event.query(`EVENT#FUTURE`, {
    lt: lt,
    index: 'GSI1',
  })

  return {}
}
