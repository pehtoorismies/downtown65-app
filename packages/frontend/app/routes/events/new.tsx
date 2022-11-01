import { Button, Container, Grid, Stepper, Group, Title } from '@mantine/core'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
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
import { validateSessionUser } from '~/session.server'
import { exhaustCheck } from '~/util/exhaust-check'
import { getEventForm } from '~/util/validation.server'

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
  const result = await validateSessionUser(request)

  switch (result.kind) {
    case 'no-session': {
      return redirect('/auth/login')
    }
    case 'error': {
      console.error(result.error)
      return redirect('/auth/login')
    }
    case 'renewed': {
      return json<LoaderData>(
        {
          user: result.user,
        },
        { headers: result.headers }
      )
    }
    case 'valid': {
      return json<LoaderData>({
        user: result.user,
      })
    }
    default: {
      exhaustCheck(result)
    }
  }
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData()

  const eventForm = getEventForm(body)

  // const { login } = await getGqlSdk().CreateEvent(
  //   {
  //     input: {
  //       createdBy: UserInput!
  //       dateStart: AWSDateTime!
  //       description: description.trim() === '' ? undefined : description
  //       location,
  //       participants: [UserInput!]
  //       race: isRace === 'true'
  //       title,
  //       type,
  //     },
  //   },
  //   getPublicAuthHeaders()
  // )

  return json({ message: `Hello` })
}

const getDateComponents = (
  d?: Date
): { month: string; year: string; date: string } | undefined => {
  if (!d) {
    return
  }

  return {
    date: `${d.getDate()}`,
    month: `${d.getMonth()}`,
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

const NewEvent = () => {
  const fetcher = useFetcher()
  const { user } = useLoaderData<LoaderData>()
  const [state, dispatch] = useReducer(reducer, INIT_STATE)

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
    }
  }, [state.submitEvent])

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
