import {
  Button,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  Modal,
  Stepper,
  Title,
} from '@mantine/core'
import { useFetcher, useNavigate, useNavigation } from '@remix-run/react'
import {
  IconAlignLeft,
  IconCalendar,
  IconCircleOff,
  IconCircleX,
  IconClockHour5,
  IconEdit,
  IconRocket,
  IconRun,
} from '@tabler/icons-react'
import type { Dispatch, FC } from 'react'
import { useState } from 'react'
import { eventStateToSubmittable } from '../event-state-to-submittable'
import { Buttons } from './buttons'
import type { EventState } from './event-state'
import { isValidStateToSave } from './event-state'
import type { EventAction, StepNumber } from './reducer'
import { ActiveStep, isStepNumber } from './reducer'
import { StepDate } from './step-date'
import { StepDescriptionClient } from './step-description.client'
import { StepPreview } from './step-preview'
import { StepTime } from './step-time'
import { StepTitle } from './step-title'
import { StepType } from './step-type'
import { ParticipatingContext } from '~/contexts/participating-context'
import type { Context } from '~/contexts/participating-context'
import type { User } from '~/domain/user'

const iconSize = 20

const TITLES: Record<
  StepNumber,
  {
    title: string
    isSkippable: boolean
  }
> = {
  [ActiveStep.STEP_EVENT_TYPE]: {
    title: 'Laji',
    isSkippable: false,
  },
  [ActiveStep.STEP_TITLE]: {
    title: 'Perustiedot',
    isSkippable: false,
  },
  [ActiveStep.STEP_DATE]: {
    title: 'Päivämäärä',
    isSkippable: false,
  },
  [ActiveStep.STEP_TIME]: {
    title: 'Kellonaika',
    isSkippable: true,
  },
  [ActiveStep.STEP_DESCRIPTION]: {
    title: 'Vapaa kuvaus',
    isSkippable: true,
  },
  [ActiveStep.STEP_PREVIEW]: {
    title: 'Esikatselu',
    isSkippable: false,
  },
}

const getModalTitle = (kind: EventState['kind']): string => {
  switch (kind) {
    case 'create': {
      return 'Keskeytä tapahtuman luonti'
    }
    case 'edit': {
      return 'Keskeytä tapahtuman muokkaus'
    }
  }
}

interface Props {
  state: EventState
  dispatch: Dispatch<EventAction>
  me: User
  participatingActions: Context
  cancelRedirectPath: string
}

export const EditOrCreate: FC<Props> = ({
  state,
  me,
  dispatch,
  participatingActions,
  cancelRedirectPath,
}): JSX.Element => {
  const [opened, setOpened] = useState(false)
  const navigation = useNavigation()
  const navigate = useNavigate()
  const fetcher = useFetcher()

  if (navigation.state === 'loading') {
    return (
      <Center py={100}>
        <Loader />
      </Center>
    )
  }

  const skipContent = (
    <Grid gutter="xs" my="sm" align="center">
      <Grid.Col span={3}>
        <Group justify="flex-end">
          <Button
            variant="outline"
            color="orange"
            size="compact-sm"
            onClick={() => setOpened(true)}
            data-testid="cancel-event-creation-button"
          >
            Keskeytä
          </Button>
        </Group>
      </Grid.Col>
      <Grid.Col span={6}>
        <Title ta="center" order={1} size="h3">
          {TITLES[state.activeStep].title}
        </Title>
      </Grid.Col>
      <Grid.Col span={3}>
        <Group justify="flex-end">
          <Button
            data-testid="skip-step-button"
            variant="outline"
            size="compact-sm"
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
  )

  return (
    <>
      <Modal
        zIndex={2000}
        opened={opened}
        onClose={() => setOpened(false)}
        title={getModalTitle(state.kind)}
        closeButtonProps={{ 'aria-label': 'Close' }}
      >
        <Group
          justify="space-between"
          mt={50}
          data-testid="confirmation-modal-content"
        >
          <Button
            onClick={() => setOpened(false)}
            leftSection={<IconCircleX size={18} />}
            data-testid="modal-close"
          >
            Sulje
          </Button>
          <Button
            onClick={() => navigate(cancelRedirectPath)}
            name="action"
            value="delete"
            type="submit"
            color="red"
            rightSection={<IconCircleOff size={18} />}
            data-testid="modal-cancel-event-creation"
          >
            Keskeytä
          </Button>
        </Group>
      </Modal>
      <Container pt={12}>
        <Stepper
          color={state.kind === 'edit' ? 'dtPink.4' : 'blue'}
          size="xs"
          active={state.activeStep}
          onStepClick={(stepIndex: number) => {
            if (!isStepNumber(stepIndex)) {
              throw new Error('Not in step range')
            }
            dispatch({ kind: 'step', step: stepIndex })
          }}
        >
          <Stepper.Step
            icon={<IconRun size={iconSize} />}
            data-testid="step-type"
          >
            <>
              {skipContent}
              <StepType state={state} dispatch={dispatch} />
            </>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={state.eventType !== undefined}
            icon={<IconEdit size={iconSize} />}
            data-testid="step-basic-info"
          >
            <>
              {skipContent}
              <StepTitle state={state} dispatch={dispatch} />
            </>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={
              state.eventType !== undefined &&
              !!state.title &&
              !!state.location &&
              !!state.subtitle
            }
            icon={<IconCalendar size={iconSize} />}
            data-testid="step-date"
          >
            <>
              {skipContent}
              <StepDate state={state} dispatch={dispatch} />
            </>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={isValidStateToSave(state)}
            icon={<IconClockHour5 size={iconSize} />}
            data-testid="step-time"
          >
            <>
              {skipContent}
              <StepTime state={state} dispatch={dispatch} />
            </>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={isValidStateToSave(state)}
            icon={<IconAlignLeft size={iconSize} />}
            data-testid="step-description"
          >
            <>
              {skipContent}
              <StepDescriptionClient state={state} dispatch={dispatch} />
            </>
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={isValidStateToSave(state)}
            icon={<IconRocket size={iconSize} />}
            data-testid="step-preview"
          >
            <>
              {skipContent}
              <ParticipatingContext.Provider value={participatingActions}>
                <StepPreview state={state} me={me} />
              </ParticipatingContext.Provider>
            </>
          </Stepper.Step>
        </Stepper>
        <Buttons
          state={state}
          onNextStep={() => {
            if (state.activeStep === ActiveStep.STEP_PREVIEW) {
              fetcher.submit(eventStateToSubmittable(state), {
                method: 'post',
              })
            } else {
              dispatch({ kind: 'nextStep' })
            }
          }}
          onPreviousStep={() => {
            dispatch({ kind: 'previousStep' })
          }}
        />
      </Container>
    </>
  )
}
