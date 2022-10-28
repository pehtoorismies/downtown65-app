import { EventCardExtended } from '~/components/event-card/event-card-extended'
import type { OnParticipateEvent } from '~/components/event-card/event-card-root'
import type { State } from '~/components/event-creation/creation-reducers'
import type { User } from '~/domain/user'

interface Properties {
  state: State
  me: User
  onParticipate: OnParticipateEvent
  onLeave: OnParticipateEvent
}

export const StepReview = ({
  state,
  me,
  onParticipate,
  onLeave,
}: Properties) => {
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
      participants={state.participants}
      me={me}
      onParticipate={onParticipate}
      onLeave={onLeave}
    />
  )
}
