import type { State } from './reducer'
import { EventCardExtended } from '~/components/event-card/event-card-extended'
import type { User } from '~/domain/user'

interface Properties {
  state: State
  me: User
}

export const StepReview = ({ state, me }: Properties) => {
  if (!state.eventType) {
    throw new Error('Illegal state, not eventType defined')
  }
  return (
    <EventCardExtended
      isRace={state.isRace}
      createdBy={me}
      location={state.location}
      title={state.title}
      type={state.eventType}
      description={state.description}
      participants={state.participants}
      me={me}
    />
  )
}
