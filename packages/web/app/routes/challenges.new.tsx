import {
  Button,
  Center,
  Container,
  Divider,
  Group,
  Stepper,
  Title,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {
  IconAlignLeft,
  IconArrowLeft,
  IconArrowRight,
  IconCircleOff,
  IconClockHour5,
  IconEdit,
  IconRocket,
} from '@tabler/icons-react'
import { addMonths, parseISO } from 'date-fns'
import React, { useReducer } from 'react'
import {
  challengeReducer,
  isActiveStep,
} from '~/routes-common/challenges/create-edit/challenge-reducer'
import { ChallengeDate } from '~/routes-common/challenges/create-edit/steps/challenge-date'
import { ChallengeDescription } from '~/routes-common/challenges/create-edit/steps/challenge-description'
import { ChallengePreview } from '~/routes-common/challenges/create-edit/steps/challenge-preview'
import { ChallengeTitle } from '~/routes-common/challenges/create-edit/steps/challenge-title'
import { loaderAuthenticate } from '~/session.server'

const ICON_SIZE = 20

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - new challenge',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await loaderAuthenticate(request)

  const now = new Date()

  return json({
    user,
    selectedMonth: addMonths(now, 1).toISOString(),
    minDate: now.toISOString(),
  })
}

export default function CreateNewChallenge() {
  const { selectedMonth, minDate } = useLoaderData<typeof loader>()

  const [challengeState, dispatch] = useReducer(challengeReducer, {
    activeStep: 0,
    date: parseISO(selectedMonth),
    minDate: parseISO(minDate),
    description: '',
    subtitle: '',
    title: '',
    nextButtonText: undefined,
    prevButtonText: undefined,
    nextButtonIcon: IconArrowRight,
  })

  return (
    <Container pt={12}>
      <Title order={1} size="h5">
        Haaste: {challengeState.title || 'uusi haaste'}
      </Title>
      <Stepper
        size="xs"
        active={challengeState.activeStep}
        onStepClick={(n) => {
          if (!isActiveStep(n)) {
            throw new Error(`Illegal step (${n}) in stepper`)
          }
          dispatch({ kind: 'stepClick', value: n })
        }}
        color="yellow"
        my="md"
      >
        <Stepper.Step
          allowStepSelect={true}
          icon={<IconEdit size={ICON_SIZE} />}
          data-testid="step-basic-info"
        >
          <ChallengeTitle state={challengeState} dispatch={dispatch} />
        </Stepper.Step>
        <Stepper.Step
          icon={<IconClockHour5 size={ICON_SIZE} />}
          data-testid="step-date"
          allowStepSelect={!!challengeState.title && !!challengeState.subtitle}
        >
          <ChallengeDate state={challengeState} dispatch={dispatch} />
        </Stepper.Step>
        <Stepper.Step
          icon={<IconAlignLeft size={ICON_SIZE} />}
          data-testid="step-description"
          allowStepSelect={!!challengeState.title && !!challengeState.subtitle}
        >
          <ChallengeDescription state={challengeState} dispatch={dispatch} />
        </Stepper.Step>
        <Stepper.Step
          icon={<IconRocket size={ICON_SIZE} />}
          data-testid="step-preview"
          allowStepSelect={!!challengeState.title && !!challengeState.subtitle}
        >
          <ChallengePreview state={challengeState} dispatch={dispatch} />
        </Stepper.Step>
      </Stepper>
      <Group justify="space-between">
        <Button
          style={{
            visibility: challengeState.prevButtonText ? 'visible' : 'hidden',
          }}
          color="yellow"
          leftSection={<IconArrowLeft size={ICON_SIZE} />}
          onClick={() => dispatch({ kind: 'previous' })}
        >
          {challengeState.prevButtonText}
        </Button>
        <Button
          style={{
            visibility: challengeState.nextButtonText ? 'visible' : 'hidden',
          }}
          color="yellow"
          rightSection={<challengeState.nextButtonIcon size={ICON_SIZE} />}
          onClick={() => dispatch({ kind: 'next' })}
        >
          {challengeState.nextButtonText}
        </Button>
      </Group>
      <Divider label="Danger zone" />
      <Center>
        <Button my="md" color="red" rightSection={<IconCircleOff size={18} />}>
          Keskeytä uuden haasteen luonti
        </Button>
      </Center>
    </Container>
  )
}
