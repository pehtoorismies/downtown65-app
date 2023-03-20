import type { EventState } from './components/event-state'

const getDateComponents = (
  d?: Date
): { month: string; year: string; day: string } | undefined => {
  if (!d) {
    return
  }

  return {
    day: `${d.getDate()}`,
    month: `${d.getMonth() + 1}`,
    year: `${d.getFullYear()}`,
  }
}

const getTimeComponents = (
  time: EventState['time']
): { minutes: string; hours: string } | undefined => {
  if (time.minutes === undefined || time.hours === undefined) {
    return
  }
  return {
    hours: `${time.hours}`,
    minutes: `${time.minutes}`,
  }
}

export const eventStateToSubmittable = (eventState: EventState) => {
  if (eventState.eventType === undefined) {
    throw new Error('Cannot submit undefined eventType')
  }
  const dateComponents = getDateComponents(eventState.date)
  if (dateComponents === undefined) {
    throw new Error('Cannot submit undefined date')
  }

  return {
    ...dateComponents,
    ...getTimeComponents(eventState.time),
    description: eventState.description,
    eventType: eventState.eventType,
    isRace: eventState.isRace ? 'true' : 'false',
    location: eventState.location,
    participants: JSON.stringify(eventState.participants),
    subtitle: eventState.subtitle,
    title: eventState.title,
  }
}
