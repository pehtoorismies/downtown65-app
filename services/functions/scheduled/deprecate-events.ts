import { format } from 'date-fns'
import formatISO from 'date-fns/formatISO'
import startOfToday from 'date-fns/startOfToday'
import { getTable } from '../db/table'

export const main = async () => {
  const Table = getTable()

  const d = startOfToday()

  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd'
  )
  console.log(`Deprecate events that are less than ${lt}`)

  const results = await Table.Dt65Event.query(`EVENT#FUTURE`, {
    lt: lt,
    // 2021-11-11T10:00:00+02:00
    index: 'GSI1',
  })

  console.log('Results:')
  console.log(results.Items)

  return {}
}
