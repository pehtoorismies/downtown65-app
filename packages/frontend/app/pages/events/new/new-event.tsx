import { Button, Container, Grid, Stepper, Group, Title } from '@mantine/core'
import { useFetcher, useLoaderData } from '@remix-run/react'
import {
  IconAlignLeft,
  IconCalendar,
  IconClockHour5,
  IconEdit,
  IconRocket,
  IconRun,
} from '@tabler/icons'
import { useEffect, useReducer } from 'react'
import { Buttons } from './components/buttons'
import { ActiveStep, reducer } from './components/reducer'
import type { State, StepNumber } from './components/reducer'
import { StepDate } from './components/step-date'
import { StepDescriptionClient } from './components/step-description.client'
import { StepReview } from './components/step-review'
import { StepTime } from './components/step-time'
import { StepTitle } from './components/step-title'
import { StepType } from './components/step-type'
import type { LoaderData } from './loader'
import type { Context } from '~/contexts/participating-context'
import { ParticipatingContext } from '~/contexts/participating-context'

const iconSize = 20

const INIT_STATE: State = {
  activeStep: ActiveStep.STEP_EVENT_TYPE,
  title: '',
  location: '',
  isRace: false,
  time: {},
  description: 'asdadsjdasladskj adlkjadsladksj adlskj',
  participants: [],
  submitEvent: false,
}

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

const getDateComponents = (
  d?: Date
): { month: string; year: string; day: string } | undefined => {
  if (!d) {
    return
  }

  return {
    day: `${d.getDate()}`,
    month: `${d.getMonth() + 1}`,
    year: `${d.getFullYear()}`,
  }
}

const getTimeComponents = (
  time: State['time']
): { minutes: string; hours: string } | undefined => {
  if (time.minutes === undefined || time.hours === undefined) {
    return
  }
  return {
    hours: `${time.hours}`,
    minutes: `${time.minutes}`,
  }
}

export const NewEvent = () => {
  const fetcher = useFetcher()
  const { me } = useLoaderData<LoaderData>()
  const [state, dispatch] = useReducer(reducer, INIT_STATE)
  const participatingActions: Context = {
    onLeave: () => {
      dispatch({ kind: 'leaveEvent' })
    },
    onParticipate: () => {
      dispatch({ kind: 'participateEvent', me })
    },
    state: 'idle',
    loadingEventId: 'not-defined',
  }

  useEffect(() => {
    if (state.submitEvent) {
      fetcher.submit(
        {
          title: state.title,
          eventType: state.eventType ?? '',
          location: state.location,
          isRace: state.isRace ? 'true' : 'false',
          ...getDateComponents(state.date),
          ...getTimeComponents(state.time),
          description: state.description,
          participants: JSON.stringify(state.participants),
        },
        { method: 'post', action: '/events/new' }
      )
      dispatch({ kind: 'formSubmitted' })
    }
  }, [
    state.submitEvent,
    fetcher,
    state.date,
    state.description,
    state.eventType,
    state.isRace,
    state.location,
    state.participants,
    state.time,
    state.title,
  ])

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
        <StepType
          selectedEventType={state.eventType}
          onSelect={(type) => {
            dispatch({ kind: 'type', type })
          }}
        />
      )}
      {state.activeStep === ActiveStep.STEP_TITLE && (
        <StepTitle
          title={state.title}
          location={state.location}
          eventType={state.eventType}
          onSetTitle={(title) => {
            dispatch({ kind: 'title', title })
          }}
          onSetLocation={(location) => {
            dispatch({ kind: 'location', location })
          }}
          isRace={state.isRace}
          onSetRace={(isRace) => {
            dispatch({ kind: 'race', isRace })
          }}
        />
      )}
      {state.activeStep === ActiveStep.STEP_DATE && (
        <StepDate
          date={state.date}
          onSetDate={(date) => {
            dispatch({ kind: 'date', date })
          }}
        />
      )}
      {state.activeStep === ActiveStep.STEP_TIME && (
        <StepTime
          time={state.time}
          onSetTime={(time) => {
            dispatch({ kind: 'time', time })
          }}
        />
      )}
      {state.activeStep === ActiveStep.STEP_DESCRIPTION && (
        <StepDescriptionClient
          description={state.description}
          onSetDescription={(description) => {
            dispatch({ kind: 'description', description })
          }}
        />
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
