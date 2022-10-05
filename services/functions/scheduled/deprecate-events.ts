import { format } from 'date-fns'
import startOfToday from 'date-fns/startOfToday'
import { getTable } from '../../dynamo/table'

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
    index: 'GSI1',
  })

  console.log('Results:')
  console.log(results.Items)

  return {}
}
