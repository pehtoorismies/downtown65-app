import type { ISODate, ISOTime } from '@downtown65-app/core/time-functions'
import { toISODatetimeCompact } from '@downtown65-app/core/time-functions'
import { format, formatWithOptions, parse, parseISO } from 'date-fns/fp'
import { fi } from 'date-fns/locale/fi'
import * as R from 'remeda'

export const groupByMonth = <
  T extends { dateStart: ISODate; timeStart?: ISOTime },
>(
  x: T[]
) => {
  return R.pipe(
    x,
    R.map((x) => {
      return {
        ...x,
        isoDate: toISODatetimeCompact(x.dateStart, x.timeStart),
        yearMonth: R.pipe(x.dateStart, parseISO, format('yyyy-MM')),
      }
    }),
    R.groupBy((x) => x.yearMonth),
    R.toPairs,
    R.map(([key, events]) => {
      const k = R.pipe(
        key,
        parse(new Date(), 'yyyy-MM'),
        formatWithOptions({ locale: fi }, `LLLL yyyy`)
      )

      const sorted = R.pipe(
        events,
        R.sortBy((x) => x.isoDate)
      )

      return {
        date: k,
        events: R.pipe(sorted, R.map(R.omit(['isoDate', 'yearMonth']))),
      }
    })
  )
}
