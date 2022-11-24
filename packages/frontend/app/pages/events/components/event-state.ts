import type { User } from '~/domain/user'
import type { EventType } from '~/gql/types.gen'
import type { StepNumber } from '~/pages/events/components/reducer'

export interface EventState {
  eventType?: EventType
  title: string
  subtitle: string
  location: string
  isRace: boolean
  date: Date
  activeStep: StepNumber
  time: {
    hours?: number
    minutes?: number
  }
  description: string
  participants: User[]
  submitEvent: boolean
}
