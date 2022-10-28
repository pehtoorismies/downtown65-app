import { Button, Container, Grid, Stepper, Group, Title } from '@mantine/core'
import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
  IconAlignLeft,
  IconCalendar,
  IconClockHour5,
  IconEdit,
  IconRocket,
  IconRun,
} from '@tabler/icons'
import { useEffect, useReducer } from 'react'
import { Buttons } from '~/components/event-creation/buttons'
import type {
  State,
  StepNumber,
} from '~/components/event-creation/creation-reducers'
import {
  ActiveStep,
  reducer,
} from '~/components/event-creation/creation-reducers'
import { StepDate } from '~/components/event-creation/step-date'
import { StepDescriptionClient } from '~/components/event-creation/step-description.client'
import { StepReview } from '~/components/event-creation/step-review'
import { StepTime } from '~/components/event-creation/step-time'
import { StepTitle } from '~/components/event-creation/step-title'
import { StepType } from '~/components/event-creation/step-type'
import type { User } from '~/domain/user'
import { getUser } from '~/session.server'

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

interface LoaderData {
  user: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  if (!user) {
    return redirect('/auth/login')
  }
  return json<LoaderData>({
    user: {
      id: '123',
      nickname: 'koira',
      picture: 'asd',
    },
  })
}

const NewEvent = () => {
  const { user } = useLoaderData<LoaderData>()
  const [state, dispatch] = useReducer(reducer, INIT_STATE)

  useEffect(() => {}, [state.submitEvent])

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
        <StepReview
          state={state}
          me={user}
          onLeave={() => {
            dispatch({ kind: 'leaveEvent' })
          }}
          onParticipate={(me) => {
            dispatch({ kind: 'participateEvent', me })
          }}
        />
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

export default NewEvent
