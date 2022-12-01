import { EventCardExtended } from '~/components/event-card/event-card-extended'
import type { User } from '~/domain/user'
import type { EventState } from '~/pages/events/components/event-state'
import { prefixZero, suffixZero } from '~/util/pad-zeros'

interface Properties {
  state: EventState
  me: User
}

const getDate = (date: EventState['date']) => {
  if (!date) {
    return 'Missing date'
  }

  return `${prefixZero(date.getDate())}.${prefixZero(
    date.getMonth() + 1
  )}.${date.getFullYear()}`
}

const getTime = ({ hours, minutes }: EventState['time']) => {
  if (hours !== undefined && minutes !== undefined) {
    return `${prefixZero(hours)}:${suffixZero(minutes)}`
  }
}

export const StepPreview = ({ state, me }: Properties) => {
  if (!state.eventType) {
    throw new Error('Illegal state, not eventType defined')
  }
  return (
    <EventCardExtended
      createdBy={me}
      dateStart={getDate(state.date)}
      description={state.description}
      isRace={state.isRace}
      location={state.location}
      me={me}
      participants={state.participants}
      subtitle={state.subtitle}
      timeStart={getTime(state.time)}
      title={state.title}
      type={state.eventType}
    />
  )
}
