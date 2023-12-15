import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import React from 'react'
import type { EventState } from './event-state'
import { EventCard } from '~/components/event/event-card'
import type { User } from '~/domain/user'
import { prefixZero, suffixZero } from '~/util/pad-zeros'

interface Properties {
  state: EventState
  me: User
}

const getDate = (date: EventState['date']) => {
  if (!date) {
    return 'Missing date'
  }
  return format(date, 'd.M.yyyy (EEEEEE)', { locale: fi })
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
    <EventCard
      title={state.title}
      race={state.isRace}
      subtitle={state.subtitle}
      location={state.location}
      type={state.eventType}
      createdBy={me}
      participants={state.participants}
      dateStart={getDate(state.date)}
      timeStart={getTime(state.time)}
    />
  )
}
