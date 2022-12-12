import type { Dispatch } from 'react'
import type { User } from '~/domain/user'
import type { EventType } from '~/gql/types.gen'
import type { EventState } from '~/routes/events/modules/components/event-state'

export const ActiveStep = {
  STEP_EVENT_TYPE: 0,
  STEP_TITLE: 1,
  STEP_DATE: 2,
  STEP_TIME: 3,
  STEP_DESCRIPTION: 4,
  STEP_REVIEW: 5,
} as const

export type StepNumber = typeof ActiveStep[keyof typeof ActiveStep]

type TitleAction = {
  kind: 'title'
  title: string
}
type SubtitleAction = {
  kind: 'subtitle'
  subtitle: string
}
type TypeAction = {
  kind: 'type'
  type: EventType
}

type LocationAction = {
  kind: 'location'
  location: string
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
type FormSubmittedAction = {
  kind: 'formSubmitted'
}
export type ToPreviewAction = {
  kind: 'toPreview'
}

export type EventAction =
  | DateAction
  | DescriptionAction
  | FormSubmittedAction
  | LeaveEventAction
  | LocationAction
  | NextStepAction
  | ParticipateEventAction
  | PreviousStepAction
  | RaceAction
  | StepAction
  | SubtitleAction
  | TimeAction
  | TitleAction
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
    case 'title': {
      return { ...state, title: action.title }
    }
    case 'subtitle': {
      return { ...state, subtitle: action.subtitle }
    }
    case 'location': {
      return { ...state, location: action.location }
    }
    case 'step': {
      return { ...state, activeStep: action.step }
    }
    case 'nextStep': {
      if (state.activeStep === ActiveStep.STEP_REVIEW) {
        return {
          ...state,
          submitEvent: true,
        }
      }
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
    case 'formSubmitted': {
      return {
        ...state,
        submitEvent: false,
      }
    }
    case 'toPreview': {
      return {
        ...state,
        activeStep: ActiveStep.STEP_REVIEW,
      }
    }
  }
}
