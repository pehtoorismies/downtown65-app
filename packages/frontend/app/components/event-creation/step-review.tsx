import { EventCardExtended } from '~/components/event-card/event-card-extended'
import type { State } from '~/components/event-creation/creation-reducers'
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
      creator={me}
      location={state.location}
      title={state.title}
      type={state.eventType}
      description={state.description}
      participants={[]}
      me={me}
    />
  )
}
