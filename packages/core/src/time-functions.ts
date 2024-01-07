import {
  formatISO,
  formatWithOptions,
  isValid,
  parse,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from 'date-fns/fp'
import { fi } from 'date-fns/locale/fi'
import { pipe } from 'remeda'
import { z } from 'zod'

const isValidISODate = (date: string) => {
  const match = date.match(/^\d{4}-\d{2}-\d{2}$/)
  if (match === null) {
    return false
  }

  return pipe(date, isoDateParser, isValid) as unknown as boolean
}

const isValidISOTime = (time: string) => {
  return time.match(/^([01]\d|2[0-3]):[0-5]\d$/) !== null
}

export const ISODate = z
  .string()
  .refine((value) => isValidISODate(value), {
    message: 'String is not formatted as ISODate',
  })
  .brand<'ISODate'>()

export const ISOTime = z
  .string()
  .refine((value) => isValidISOTime(value), {
    message: 'String is not formatted as ISOTime',
  })
  .brand<'ISOTime'>()

export type ISODate = z.infer<typeof ISODate>
export type ISOTime = z.infer<typeof ISOTime>

const isoDateParser = parse(new Date(), 'yyyy-MM-dd')
const formatFinnish = formatWithOptions({ locale: fi }, `d.M.yyyy (EEEEEE)`)
const timeParser = parse(new Date(), 'HH:mm')

type TimeInput = string | { hours: number; minutes: number }

const padStart = (x: number) => String(x).padStart(2, '0')

const toTimeFormat = (hours: number, minutes: number) =>
  `${padStart(hours)}:${padStart(minutes)}`

type DateInput = Date | string

const getDateAsString = (date: DateInput) => {
  if (typeof date === 'string') {
    return date
  }
  const result = z.date().safeParse(date)
  if (result.success) {
    return result.data.toISOString().slice(0, 10)
  }
  return result.error
}

export const padTime = (x: number): string => {
  if (x < 10) {
    return String(x).padStart(2, '0')
  }
  return String(x)
}

export const toISODate = (date: DateInput) => {
  const d = getDateAsString(date)
  return ISODate.safeParse(d)
}

export const toFormattedDate = (date: ISODate) => {
  return pipe(date, isoDateParser, formatFinnish) as unknown as string
}

export const toTimeComponents = (time: ISOTime) => {
  const timeDate = timeParser(time)

  return {
    minutes: timeDate.getMinutes(),
    hours: timeDate.getHours(),
  }
}

export const toISODatetimeCompact = (date: ISODate | Date, time?: ISOTime) => {
  if (date instanceof Date) {
    if (!isValid(date)) {
      throw new Error('Provided date object is not valid')
    }
    return formatISO(date).slice(0, 19)
  }
  const { hours, minutes } = time
    ? getTimeComponents(time)
    : { hours: 0, minutes: 0 }

  const iso = pipe(
    date,
    isoDateParser,
    setHours(hours),
    setMinutes(minutes),
    formatISO
  ) as unknown as string

  return iso.slice(0, 19)
}

const getTimeAsString = (time: TimeInput) => {
  if (typeof time === 'string') {
    return time
  }
  return toTimeFormat(time.hours, time.minutes)
}

export const toDate = (date: ISODate, time?: ISOTime) => {
  const { hours, minutes } = time
    ? getTimeComponents(time)
    : { hours: 0, minutes: 0 }

  return pipe(
    date,
    isoDateParser,
    setHours(hours),
    setMinutes(minutes),
    setSeconds(0),
    setMilliseconds(0)
  ) as unknown as Date
}

export const toISOTime = (time: TimeInput) => {
  const t = getTimeAsString(time)
  return ISOTime.safeParse(t)
}

const getTimeComponents = (time: ISOTime) => {
  const timeDate = timeParser(time)

  return {
    minutes: timeDate.getMinutes(),
    hours: timeDate.getHours(),
  }
}
