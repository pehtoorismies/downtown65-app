import type { EventType } from '~/generated/graphql'
import type { StepNumber } from './reducer'
import type { User } from '~/domain/user'

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
  kind: 'edit' | 'create'
}
