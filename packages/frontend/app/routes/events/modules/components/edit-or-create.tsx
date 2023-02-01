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
import type { Context } from '~/contexts/participating-context'
import { ParticipatingContext } from '~/contexts/participating-context'
import type { User } from '~/domain/user'
import { Buttons } from '~/routes/events/modules/components/buttons'
import type { EventState } from '~/routes/events/modules/components/event-state'
import { isValidStateToSave } from '~/routes/events/modules/components/event-state'
import type {
  EventAction,
  StepNumber,
} from '~/routes/events/modules/components/reducer'
import { ActiveStep } from '~/routes/events/modules/components/reducer'
import { StepDate } from '~/routes/events/modules/components/step-date'
import { StepDescriptionClient } from '~/routes/events/modules/components/step-description.client'
import { StepPreview } from '~/routes/events/modules/components/step-preview'
import { StepTime } from '~/routes/events/modules/components/step-time'
import { StepTitle } from '~/routes/events/modules/components/step-title'
import { StepType } from '~/routes/events/modules/components/step-type'
import { eventStateToSubmittable } from '~/routes/events/modules/event-state-to-submittable'

const iconSize = 20

const TITLES: Record<StepNumber, { title: string; isSkippable: boolean }> = {
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

  return (
    <>
      <Modal
        data-testid="confirmation-modal"
        zIndex={2000}
        opened={opened}
        onClose={() => setOpened(false)}
        title={getModalTitle(state.kind)}
        closeButtonLabel="Close"
      >
        <Group position="apart" mt={50}>
          <Button
            onClick={() => setOpened(false)}
            leftIcon={<IconCircleX size={18} />}
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
            rightIcon={<IconCircleOff size={18} />}
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
          onStepClick={(stepIndex: StepNumber) => {
            dispatch({ kind: 'step', step: stepIndex })
          }}
        >
          <Stepper.Step
            icon={<IconRun size={iconSize} />}
            data-testid="step-type"
          />
          <Stepper.Step
            allowStepSelect={state.eventType !== undefined}
            icon={<IconEdit size={iconSize} />}
            data-testid="step-basic-info"
          />
          <Stepper.Step
            allowStepSelect={
              state.eventType !== undefined &&
              !!state.title &&
              !!state.location &&
              !!state.subtitle
            }
            icon={<IconCalendar size={iconSize} />}
            data-testid="step-date"
          />
          <Stepper.Step
            allowStepSelect={isValidStateToSave(state)}
            icon={<IconClockHour5 size={iconSize} />}
            data-testid="step-time"
          />
          <Stepper.Step
            allowStepSelect={isValidStateToSave(state)}
            icon={<IconAlignLeft size={iconSize} />}
            data-testid="step-description"
          />
          <Stepper.Step
            allowStepSelect={isValidStateToSave(state)}
            icon={<IconRocket size={iconSize} />}
            data-testid="step-preview"
          />
        </Stepper>
        <Grid gutter="xs" my="sm" align="center">
          <Grid.Col span={3}>
            <Group position="left">
              <Button
                variant="outline"
                color="orange"
                compact
                onClick={() => setOpened(true)}
                data-testid="cancel-event-creation-button"
              >
                Keskeytä
              </Button>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Title align="center" order={1} size="h3">
              {TITLES[state.activeStep].title}
            </Title>
          </Grid.Col>
          <Grid.Col span={3}>
            <Group position="right">
              <Button
                data-testid="skip-step-button"
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
        {state.activeStep === ActiveStep.STEP_PREVIEW && (
          <ParticipatingContext.Provider value={participatingActions}>
            <StepPreview state={state} me={me} />
          </ParticipatingContext.Provider>
        )}
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
