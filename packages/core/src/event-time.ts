import { formatISO, parse } from "date-fns";
import { setHours, setMinutes } from 'date-fns/fp'
import * as R from 'remeda'

enum DateStringBrand {}

enum TimeStringBrand {}

export type DateString = string & DateStringBrand
export type TimeString = string & TimeStringBrand

function checkValidDateString(date: string): date is DateString {
  // TODO: validate is correct date
  return date.match(/^\d{4}-\d{2}-\d{2}$/) !== null
}

function checkValidTimeString(date: string): date is TimeString {
  return date.match(/^([01]\d|2[0-3]):[0-5]\d$/) !== null
}

export const toDateString = (date: Date | string): DateString => {
  if (typeof date === 'string') {
    if (checkValidDateString(date)) {
      return date
    } else {
      throw new Error(`Invalid date string: ${date}`)
    }
  } else {
    const dateString = date.toISOString().slice(0, 10)
    if (checkValidDateString(dateString)) {
      return dateString
    }
  }
  throw new Error(`Invalid DateString provided): ${date}`)
}

export const toTimeString = (time: string): TimeString => {
  if (checkValidTimeString(time)) {
    return time
  }
  throw new Error(`Invalid DateString provided): ${time}`)
}

const getTimeComponents = (time: TimeString) => {
  const timeDate = parse(time, 'mm:HH', new Date())
  return {
    minutes: timeDate.getMinutes(),
    hours: timeDate.getHours(),
  }
}

const toDate = (date: DateString, time?: TimeString) {
  if (!time) {
    
  }
}

export class EventTime {
  time: TimeString | undefined
  date: DateString

  private constructor(date: DateString, time?: TimeString) {
    this.date = date
    this.time = time
  }

  create(date: string, time?: string) {
    const d = toDateString(date)
    const t = time === undefined ? undefined : toTimeString(time)
    return new EventTime(d, t)
  }

  // 2023-10-08T00:00:00
  getISODateTime() {
    const date = parse(this.date, 'yyyy-MM-dd', new Date())
    if (this.time) {
      const { hours, minutes } = getTimeComponents(this.time)
      const datetime = R.pipe(date, setHours(hours), setMinutes(minutes))
    } else {
      return formatISO()
    }
  }
}
