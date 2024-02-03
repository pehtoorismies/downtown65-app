import { toISODate, toISOTime } from '@downtown65-app/time'
import type { EventState } from './components/event-state'

const getAsISOTime = (time: EventState['time']) => {
  if (time.minutes === undefined || time.hours === undefined) {
    return
  }
  const result = toISOTime({
    hours: time.hours,
    minutes: time.minutes,
  })

  return result.success ? result.data : undefined
}

export const eventStateToSubmittable = (eventState: EventState) => {
  if (eventState.eventType === undefined) {
    throw new Error('Cannot submit undefined eventType')
  }

  const dateResult = toISODate(eventState.date)
  if (!dateResult.success) {
    throw new Error('Date format is incorrect')
  }

  const timeValue = getAsISOTime(eventState.time)

  return {
    date: dateResult.data,
    description: eventState.description,
    eventType: eventState.eventType,
    isRace: eventState.isRace ? 'true' : 'false',
    location: eventState.location,
    participants: JSON.stringify(eventState.participants),
    subtitle: eventState.subtitle,
    title: eventState.title,
    time: timeValue ?? '',
  }
}
