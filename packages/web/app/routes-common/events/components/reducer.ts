import type { EventType } from '@downtown65-app/graphql/graphql'
import type { Dispatch } from 'react'
import type { EventState } from './event-state'
import type { User } from '~/domain/user'

export const ActiveStep = {
  STEP_EVENT_TYPE: 0,
  STEP_TITLE: 1,
  STEP_DATE: 2,
  STEP_TIME: 3,
  STEP_DESCRIPTION: 4,
  STEP_PREVIEW: 5,
} as const

export type StepNumber = (typeof ActiveStep)[keyof typeof ActiveStep]

export const isStepNumber = (step: number): step is StepNumber => {
  return Object.values(ActiveStep).includes(step as StepNumber)
}

type InfoAction = {
  kind: 'info'
  title: string
  subtitle: string
  location: string
  activeStep: StepNumber
}

type TypeAction = {
  kind: 'type'
  type: EventType
}

type StepAction = {
  kind: 'step'
  step: StepNumber
}
type NextStepAction = {
  kind: 'nextStep'
}
type PreviousStepAction = {
  kind: 'previousStep'
}
type RaceAction = {
  kind: 'race'
  isRace: boolean
}
type DateAction = {
  kind: 'date'
  date: Date
}
type TimeAction = {
  kind: 'time'
  time: {
    minutes?: number
    hours?: number
  }
}
type DescriptionAction = {
  kind: 'description'
  description: string
}
type ParticipateEventAction = {
  kind: 'participateEvent'
  me: User
}
type LeaveEventAction = {
  kind: 'leaveEvent'
  me: User
}
export type ToPreviewAction = {
  kind: 'toPreview'
}

export type EventAction =
  | DateAction
  | DescriptionAction
  | InfoAction
  | LeaveEventAction
  | NextStepAction
  | ParticipateEventAction
  | PreviousStepAction
  | RaceAction
  | StepAction
  | TimeAction
  | ToPreviewAction
  | TypeAction

export interface ReducerProps {
  state: EventState
  dispatch: Dispatch<EventAction>
}

export const reducer = (state: EventState, action: EventAction): EventState => {
  switch (action.kind) {
    case 'type': {
      if (!state.eventType) {
        return {
          ...state,
          eventType: action.type,
          activeStep: ActiveStep.STEP_TITLE,
        }
      }
      return { ...state, eventType: action.type }
    }
    case 'info': {
      return {
        ...state,
        title: action.title,
        subtitle: action.subtitle,
        location: action.location,
        activeStep: action.activeStep,
      }
    }
    case 'step': {
      return { ...state, activeStep: action.step }
    }
    case 'nextStep': {
      return {
        ...state,
        activeStep: (state.activeStep + 1) as StepNumber,
      }
    }
    case 'previousStep': {
      return {
        ...state,
        activeStep: (state.activeStep - 1) as StepNumber,
      }
    }
    case 'race': {
      return {
        ...state,
        isRace: action.isRace,
      }
    }
    case 'date': {
      return {
        ...state,
        date: action.date,
      }
    }
    case 'time': {
      return {
        ...state,
        time: action.time,
      }
    }
    case 'description': {
      return {
        ...state,
        description: action.description,
      }
    }
    case 'participateEvent': {
      return {
        ...state,
        participants: [...state.participants, action.me],
      }
    }
    case 'leaveEvent': {
      return {
        ...state,
        participants: state.participants.filter((x) => x.id !== action.me.id),
      }
    }
    case 'toPreview': {
      return {
        ...state,
        activeStep: ActiveStep.STEP_PREVIEW,
      }
    }
  }
}
