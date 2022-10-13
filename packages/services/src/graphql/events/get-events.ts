import type { AppSyncResolverHandler } from 'aws-lambda'
import { format } from 'date-fns'
import startOfToday from 'date-fns/startOfToday'
import type { Event as Dt65Event } from '../../appsync'
import { getTable } from '~/dynamo/table'
import type { EmptyArgs } from '~/graphql/support/empty-args'

const getExpression = (d: Date) => {
  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd'
  )
  return `DATE#${lt}`
}

export const getEvents: AppSyncResolverHandler<
  EmptyArgs,
  Dt65Event[]
> = async () => {
  const Table = getTable()

  const query = getExpression(startOfToday())

  const results = await Table.Dt65Event.query(`EVENT#FUTURE`, {
    index: 'GSI1',
    gt: query,
  })

  return results.Items
}
