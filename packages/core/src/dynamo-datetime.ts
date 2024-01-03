import { format, formatISO, isAfter, isValid, parse } from 'date-fns'
import { fi } from 'date-fns/locale/fi'

type ISODate = string
type ISOTime = string

interface TimeComponents {
  hours: number
  minutes: number
}

interface DateComponents {
  year: number
  month: number
  day: number
}

type ComponentInput = {
  dateComponents: DateComponents
  timeComponents?: TimeComponents
  kind: 'component'
}

type ISOInput = {
  isoDate: ISODate
  isoTime?: ISOTime
  kind: 'iso'
}

type DateInput = {
  date: Date
  kind: 'date'
}

type Input = ComponentInput | ISOInput | DateInput

const throwDateError = (date: ISODate): never => {
  throw new Error(`Date is incorrect. Use YYYY-MM-DD. Received ${date}`)
}
const throwTimeError = (time: ISOTime): never => {
  throw new Error(
    `Time is incorrect. Use hours 0 - 23 and minutes 0 - 59. Received ${time}`
  )
}

const dateRegexp = /^\d{4}-\d{2}-\d{2}$/
const timeRegexp = /^(\d{2}):(\d{2})$/

const parseISODate = (d: string): DateComponents => {
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

const parseTimeComponents = (
  times?: TimeComponents
): TimeComponents | undefined => {
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

const parseISOTime = (t: string | undefined): TimeComponents | undefined => {
  if (!t) {
    return
  }

  const matches = t.match(timeRegexp)
  if (!matches || !matches[1] || !matches[2]) {
    return throwTimeError(t)
  }

  return parseTimeComponents({
    hours: Number(matches[1]),
    minutes: Number(matches[2]),
  })
}

const parseDateComponents = (dates: DateComponents): DateComponents => {
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

const parseDate = (date: Date) => {
  if (!isValid(date)) {
    throw new Error('Date is not valid')
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

const padStartWith0 = (n: number) => String(n).padStart(2, '0')

export class DynamoDatetime {
  timeComponents: TimeComponents | undefined
  dateComponents: DateComponents

  private constructor(input: Input) {
    switch (input.kind) {
      case 'component': {
        this.dateComponents = parseDateComponents(input.dateComponents)
        this.timeComponents = parseTimeComponents(input.timeComponents)
        break
      }
      case 'iso': {
        this.dateComponents = parseISODate(input.isoDate)
        this.timeComponents = parseISOTime(input.isoTime)
        break
      }
      case 'date': {
        this.dateComponents = parseDate(input.date)
      }
    }
  }

  getTime(): string | undefined {
    if (this.timeComponents === undefined) {
      return
    }

    return `${padStartWith0(this.timeComponents.hours)}:${padStartWith0(
      this.timeComponents.minutes
    )}`
  }

  getISODate(): string {
    const { year, month, day } = this.dateComponents
    return format(new Date(year, month - 1, day), 'yyyy-MM-dd')
  }

  getDateComponents(): DateComponents {
    return this.dateComponents
  }

  getTimeComponents(): TimeComponents | undefined {
    return this.timeComponents
  }

  getIsoDatetime(): string {
    const { day, year, month } = this.dateComponents

    const d = this.timeComponents
      ? new Date(
          year,
          month - 1,
          day,
          this.timeComponents.hours,
          this.timeComponents.minutes
        )
      : new Date(year, month - 1, day)

    return formatISO(d).slice(0, 19)
  }

  getFormattedDate(): string {
    return format(
      new Date(
        this.dateComponents.year,
        this.dateComponents.month - 1,
        this.dateComponents.day
      ),
      `d.M.yyyy (EEEEEE)`,
      { locale: fi }
    )
  }

  getDateObject(): Date {
    const { day, year, month } = this.dateComponents

    return this.timeComponents
      ? new Date(
          year,
          month - 1,
          day,
          this.timeComponents.hours,
          this.timeComponents.minutes
        )
      : new Date(year, month - 1, day)
  }

  static fromISO(isoDate: ISODate, isoTime?: ISOTime) {
    return new DynamoDatetime({ isoDate, isoTime, kind: 'iso' })
  }

  static fromComponents(
    dateComponents: DateComponents,
    timeComponents?: TimeComponents
  ) {
    return new DynamoDatetime({
      dateComponents,
      timeComponents,
      kind: 'component',
    })
  }

  static fromDate(date: Date) {
    return new DynamoDatetime({ date, kind: 'date' })
  }
}
