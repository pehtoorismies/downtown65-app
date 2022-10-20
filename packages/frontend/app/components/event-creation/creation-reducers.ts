import type { EventType } from '~/gql/types.gen'

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

type Action =
  | TitleAction
  | TypeAction
  | StepAction
  | NextStepAction
  | PreviousStepAction
  | LocationAction
  | RaceAction
  | DateAction
  | TimeAction
  | DescriptionAction

export interface State {
  eventType?: EventType
  title: string
  location: string
  isRace: boolean
  date?: Date
  activeStep: StepNumber
  time: {
    hours?: number
    minutes?: number
  }
  description: string
}

export const reducer = (state: State, action: Action): State => {
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
    case 'location': {
      return { ...state, location: action.location }
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
  }
}
