import type { EventType } from '@downtown65-app/graphql/graphql'
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

const isEmptyOrUndefined = (value: string | undefined): boolean => {
  return !value
}

export const isValidStateToSave = ({
  eventType,
  title,
  subtitle,
  location,
}: EventState): boolean => {
  return ![eventType, title, subtitle, location].some((element) =>
    isEmptyOrUndefined(element)
  )
}
