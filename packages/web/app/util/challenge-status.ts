import {
  endOfMonth,
  format,
  formatDistance,
  isAfter,
  isBefore,
  startOfMonth,
} from 'date-fns'
import { fi } from 'date-fns/locale'

type Ended = {
  status: 'ENDED'
  description: string
}

type Running = {
  status: 'RUNNING'
  description: string
}

type NotStarted = {
  status: 'NOT_STARTED'
  description: string
}

type ChallengeStatus = Ended | Running | NotStarted

export const challengeStatus = (
  start: Date,
  end: Date,
  now: Date
): ChallengeStatus => {
  if (isBefore(end, start)) {
    throw new Error('End date is before start date')
  }

  if (isBefore(now, start)) {
    return {
      status: 'NOT_STARTED',
      description: `${formatDistance(start, now, { locale: fi })} alkuun`,
    }
  }
  if (isAfter(now, end)) {
    return { status: 'ENDED', description: 'haaste on loppunut' }
  }

  return {
    status: 'RUNNING',
    description: `${formatDistance(end, now, { locale: fi })} jäljellä`,
  }
}

export const getChallengeStatusFromMonth = (
  month: Date,
  now: Date
): ChallengeStatus => {
  return challengeStatus(startOfMonth(month), endOfMonth(month), now)
}

export const formatRunningTime = (start: Date, end: Date) => {
  return `${format(start, 'd.M.yyyy')} - ${format(end, 'd.M.yyyy')}`
}
export const formatRunningTimeFromMonth = (month: Date) => {
  return formatRunningTime(startOfMonth(month), endOfMonth(month))
}
