import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'
import isAfter from 'date-fns/isAfter'
import isValid from 'date-fns/isValid'
import fi from 'date-fns/locale/fi'
import parse from 'date-fns/parse'

interface Times {
  hours: number
  minutes: number
}

interface Dates {
  year: number
  month: number
  day: number
}

interface Input {
  times?: Times
  dates?: Dates
  time?: string
  date?: string
}

const throwDateError = (date: string): never => {
  throw new Error(`Date is incorrect. Use YYYY-MM-DD. Received ${date}`)
}
const throwTimeError = (time: string): never => {
  throw new Error(
    `Time is incorrect. Use hours 0 - 23 and minutes 0 - 59. Received ${time}`
  )
}

const dateRegexp = /^\d{4}-\d{2}-\d{2}$/
const timeRegexp = /^(\d{2}):(\d{2})$/

const parseDate = (d: string): Dates => {
  if (!dateRegexp.test(d)) {
    return throwDateError(d)
  }

  const date = parse(d, 'yyyy-MM-dd', new Date())

  if (!isValid(date)) {
    return throwDateError(d)
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

const parseTimes = (times?: Times): Times | undefined => {
  if (times === undefined) {
    return
  }
  if (times.hours < 0 || times.hours > 23) {
    throwTimeError(`${times.hours}:${times.minutes}`)
  }
  if (times.minutes < 0 || times.minutes > 59) {
    throwTimeError(`${times.hours}:${times.minutes}`)
  }
  return times
}

const parseTime = (t: string | undefined): Times | undefined => {
  if (t === undefined) {
    return
  }
  const matches = t.match(timeRegexp)
  if (!matches || !matches[1] || !matches[2]) {
    return throwTimeError(t)
  }

  return parseTimes({
    hours: Number(matches[1]),
    minutes: Number(matches[2]),
  })
}

const parseDates = (dates: Dates): Dates => {
  const { year, month, day } = dates
  const parsed = parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date())
  if (!isValid(parsed)) {
    return throwDateError(`${year}-${month}-${day}`)
  }
  if (!isAfter(parsed, new Date(2000, 1, 1))) {
    return throwDateError(`${year}-${month}-${day}`)
  }

  return dates
}

export class DynamoDatetime {
  times: Times | undefined
  dates: Dates

  public constructor({ date, time, times, dates }: Input) {
    if (date !== undefined) {
      this.dates = parseDate(date)
      this.times = parseTime(time)
    } else if (dates !== undefined) {
      this.dates = parseDates(dates)
      this.times = parseTimes(times)
    } else {
      throw new Error('Illegal input')
    }
  }

  getTime(): string | undefined {
    if (this.times === undefined) {
      return
    }
    const { year, month, day } = this.dates
    const { minutes, hours } = this.times

    return formatISO(new Date(year, month, day, hours, minutes), {
      representation: 'time',
    }).slice(0, 5)
  }

  getDate(): string {
    const { year, month, day } = this.dates
    return format(new Date(year, month - 1, day), 'yyyy-MM-dd')
  }

  getDates(): Dates {
    return this.dates
  }

  getTimes(): Times | undefined {
    return this.times
  }

  getIsoDatetime(): string {
    const { day, year, month } = this.dates

    const d = this.times
      ? new Date(year, month - 1, day, this.times.hours, this.times.minutes)
      : new Date(year, month - 1, day)

    return formatISO(d).slice(0, 19)
  }

  getFormattedDate(): string {
    return format(
      new Date(this.dates.year, this.dates.month - 1, this.dates.day),
      `dd.MM.yyyy (EEEEEE)`,
      { locale: fi }
    )
  }
}
