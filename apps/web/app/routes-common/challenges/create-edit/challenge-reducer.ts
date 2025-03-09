import { IconArrowRight, IconRocket } from '@tabler/icons-react'
import type { Dispatch } from 'react'

type ActiveStep = 0 | 1 | 2 | 3

export const isActiveStep = (step: number): step is ActiveStep => {
  return step >= 0 && step <= 3
}

export type ChallengeAction =
  | { kind: 'title'; value: string }
  | { kind: 'subtitle'; value: string }
  | { kind: 'date'; value: Date }
  | { kind: 'description'; value: string }
  | { kind: 'stepClick'; value: ActiveStep }
  | { kind: 'previous' }
  | { kind: 'next' }

interface ButtonStates {
  prevButtonText: string | undefined
  nextButtonText: string | undefined
  nextButtonIcon: typeof IconArrowRight | typeof IconRocket
}

export interface ChallengeState extends ButtonStates {
  title: string
  subtitle: string
  date: Date
  activeStep: ActiveStep
  description: string
  minDate: Date
}

export interface ChallengeReducerProps {
  state: ChallengeState
  dispatch: Dispatch<ChallengeAction>
}

const hasValue = (s: string) => s.trim().length > 0

const getButtonStates = (state: ChallengeState): ButtonStates => {
  switch (state.activeStep) {
    case 0: {
      return {
        nextButtonText:
          hasValue(state.title) && hasValue(state.subtitle)
            ? 'Ajankohta'
            : undefined,
        nextButtonIcon: IconArrowRight,
        prevButtonText: undefined,
      }
    }
    case 1: {
      return {
        nextButtonText: 'Kuvaus',
        nextButtonIcon: IconArrowRight,
        prevButtonText: 'Perustiedot',
      }
    }
    case 2: {
      return {
        nextButtonText: 'Esikatselu',
        nextButtonIcon: IconArrowRight,
        prevButtonText: 'Ajankohta',
      }
    }
    case 3: {
      return {
        nextButtonText: 'Luo haaste',
        nextButtonIcon: IconRocket,
        prevButtonText: 'Kuvaus',
      }
    }
  }
}

const getNextState = (state: ChallengeState) => {
  return {
    ...state,
    ...getButtonStates(state),
  }
}

export const challengeReducer = (
  state: ChallengeState,
  action: ChallengeAction,
): ChallengeState => {
  switch (action.kind) {
    case 'title': {
      return getNextState({
        ...state,
        title: action.value,
      })
    }
    case 'subtitle': {
      return getNextState({
        ...state,
        subtitle: action.value,
      })
    }
    case 'date': {
      return getNextState({
        ...state,
        date: action.value,
      })
    }
    case 'description': {
      return getNextState({
        ...state,
        description: action.value,
      })
    }
    case 'stepClick': {
      return getNextState({
        ...state,
        activeStep: action.value,
      })
    }
    case 'previous': {
      const next = state.activeStep - 1
      const activeStep = isActiveStep(next) ? next : 0

      return getNextState({
        ...state,
        activeStep,
      })
    }
    case 'next': {
      const next = state.activeStep + 1
      const activeStep = isActiveStep(next) ? next : 0

      return getNextState({
        ...state,
        activeStep,
      })
    }
  }
}
