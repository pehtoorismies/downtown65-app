import { Button, Container, Grid, Group, Stepper, Title } from '@mantine/core'
import {
  IconAlignLeft,
  IconCalendar,
  IconClockHour5,
  IconEdit,
  IconRocket,
  IconRun,
} from '@tabler/icons'
import type { Dispatch } from 'react'
import type { Context } from '~/contexts/participating-context'
import { ParticipatingContext } from '~/contexts/participating-context'
import type { User } from '~/domain/user'
import { Buttons } from '~/pages/events/components/buttons'
import type { EventState } from '~/pages/events/components/event-state'
import type { EventAction, StepNumber } from '~/pages/events/components/reducer'
import { ActiveStep } from '~/pages/events/components/reducer'
import { StepDate } from '~/pages/events/components/step-date'
import { StepDescriptionClient } from '~/pages/events/components/step-description.client'
import { StepReview } from '~/pages/events/components/step-review'
import { StepTime } from '~/pages/events/components/step-time'
import { StepTitle } from '~/pages/events/components/step-title'
import { StepType } from '~/pages/events/components/step-type'

const iconSize = 20

const TITLES: Record<StepNumber, { title: string; isSkippable: boolean }> = {
  [ActiveStep.STEP_EVENT_TYPE]: {
    title: 'Laji',
    isSkippable: false,
  },
  [ActiveStep.STEP_TITLE]: {
    title: 'Kuvaus',
    isSkippable: false,
  },
  [ActiveStep.STEP_DATE]: {
    title: 'Päivämäärä',
    isSkippable: false,
  },
  [ActiveStep.STEP_TIME]: {
    title: 'Kellon aika',
    isSkippable: true,
  },
  [ActiveStep.STEP_DESCRIPTION]: {
    title: 'Kuvaus',
    isSkippable: true,
  },
  [ActiveStep.STEP_REVIEW]: {
    title: 'Esikatselu',
    isSkippable: false,
  },
}

interface Props {
  state: EventState
  dispatch: Dispatch<EventAction>
  me: User
  participatingActions: Context
}

export const EditOrCreate = ({
  state,
  me,
  dispatch,
  participatingActions,
}: Props) => {
  return (
    <Container pt={12}>
      <Stepper
        size="xs"
        active={state.activeStep}
        onStepClick={(stepIndex: StepNumber) => {
          dispatch({ kind: 'step', step: stepIndex })
        }}
      >
        <Stepper.Step icon={<IconRun size={iconSize} />} />
        <Stepper.Step icon={<IconEdit size={iconSize} />} />
        <Stepper.Step icon={<IconCalendar size={iconSize} />} />
        <Stepper.Step icon={<IconClockHour5 size={iconSize} />} />
        <Stepper.Step icon={<IconAlignLeft size={iconSize} />} />
        <Stepper.Step icon={<IconRocket size={iconSize} />} />
      </Stepper>
      <Grid gutter="xs" my="sm" align="center">
        <Grid.Col span={6} offset={3}>
          <Title align="center" order={1} size="h3">
            {TITLES[state.activeStep].title}
          </Title>
        </Grid.Col>
        <Grid.Col span={3}>
          <Group position="right">
            <Button
              variant="outline"
              compact
              disabled={!TITLES[state.activeStep].isSkippable}
              onClick={() => {
                dispatch({ kind: 'nextStep' })
              }}
            >
              Ohita
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      {state.activeStep === ActiveStep.STEP_EVENT_TYPE && (
        <StepType state={state} dispatch={dispatch} />
      )}
      {state.activeStep === ActiveStep.STEP_TITLE && (
        <StepTitle state={state} dispatch={dispatch} />
      )}
      {state.activeStep === ActiveStep.STEP_DATE && (
        <StepDate state={state} dispatch={dispatch} />
      )}
      {state.activeStep === ActiveStep.STEP_TIME && (
        <StepTime state={state} dispatch={dispatch} />
      )}
      {state.activeStep === ActiveStep.STEP_DESCRIPTION && (
        <StepDescriptionClient state={state} dispatch={dispatch} />
      )}
      {state.activeStep === ActiveStep.STEP_REVIEW && (
        <ParticipatingContext.Provider value={participatingActions}>
          <StepReview state={state} me={me} />
        </ParticipatingContext.Provider>
      )}
      <Buttons
        state={state}
        onNextStep={() => {
          dispatch({ kind: 'nextStep' })
        }}
        onPreviousStep={() => {
          dispatch({ kind: 'previousStep' })
        }}
      />
    </Container>
  )
}
