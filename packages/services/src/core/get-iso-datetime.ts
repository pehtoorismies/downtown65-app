import formatISO from 'date-fns/formatISO'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'

type ISODateTime = string

const throwDateError = (): never => {
  throw new Error('Date is incorrect. Use YYYY-MM-DD')
}
const throwTimeError = (): never => {
  throw new Error('Time is incorrect. Use hours 0 - 23 and minutes 0 - 59')
}

const onlyDateRegexp = /^\d{4}-\d{2}-\d{2}$/

interface Time {
  hours: number
  minutes: number
}

const validateDate = (date: string): void => {
  if (!onlyDateRegexp.test(date)) {
    throwDateError()
  }
  const isoDate = parseISO(date)
  if (!isValid(isoDate)) {
    throwDateError()
  }
}

const validateTime = (time?: Time): void => {
  if (time === undefined) {
    return
  }

  if (time.hours < 0 || time.hours > 23) {
    throwTimeError()
  }
  if (time.minutes < 0 || time.minutes > 59) {
    throwTimeError()
  }
}

export const getTime = (time?: Time): string | undefined => {
  if (time === undefined) {
    return
  }
  validateTime(time)

  const timeOnly = new Date(2000, 1, 1, time.hours, time.minutes)
  // drop timezone and seconds: ie. :25+02:00
  return formatISO(timeOnly, { representation: 'time' }).slice(0, -9)
}

export const getDate = (date: string): string => {
  validateDate(date)
  return formatISO(parseISO(date), { representation: 'date' })
}

export const getIsoDatetime = (date: string, time?: Time): ISODateTime => {
  validateDate(date)
  validateTime(time)

  const dateObject = parseISO(date)

  if (!time) {
    return formatISO(dateObject).slice(0, -6) // drop timezone: ie. +02:00
  }
  return formatISO(
    new Date(
      dateObject.getFullYear(),
      dateObject.getMonth(),
      dateObject.getDate(),
      time.hours,
      time.minutes
    )
  ).slice(0, -6) // drop timezone: ie. +02:00
}
