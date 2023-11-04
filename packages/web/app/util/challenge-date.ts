import {
  eachDayOfInterval,
  format,
  isAfter,
  isSameDay,
  isValid,
  parseISO,
} from 'date-fns'
import { fi } from 'date-fns/locale'

interface Props {
  startISODate: string
  endISODate: string
  todayISODate: string
  doneISODates: string[]
  outputFormat: string
}

type Result = {
  text: string
  status: 'DONE' | 'UNDONE' | 'FUTURE'
}

const fromISODate = (isoDate: string): Date => {
  const date = parseISO(isoDate)

  if (!isValid(date)) {
    throw new Error(`Invalid date ${isoDate}`)
  }
  return date
}

export const getChallengeDates = ({
  startISODate,
  endISODate,
  todayISODate,
  doneISODates,
  outputFormat,
}: Props): Result[] => {
  const start = fromISODate(startISODate)
  const end = fromISODate(endISODate)
  const today = fromISODate(todayISODate)
  const doneDates = doneISODates.map((d) => fromISODate(d))

  const result = eachDayOfInterval({
    start,
    end,
  })

  return result.map((challengeDate) => {
    const text = format(challengeDate, outputFormat, { locale: fi })

    if (isAfter(challengeDate, today)) {
      return {
        status: 'FUTURE',
        text,
      }
    }

    const status = doneDates.some((d) => {
      return isSameDay(d, challengeDate)
    })
      ? 'DONE'
      : 'UNDONE'

    return {
      text,
      status,
    }
  })
}
