import { Button, Container, Group, Modal, Stepper } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useFetcher, useNavigate } from '@remix-run/react'
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
import { useState } from 'react'
import type { Dispatch, FC } from 'react'
import { ParticipatingContext } from '~/contexts/participating-context'
import type { Context } from '~/contexts/participating-context'
import type { User } from '~/domain/user'
import { eventStateToSubmittable } from '~/routes-common/events/event-state-to-submittable'
import type { EventState } from './event-state'
import { isStepNumber } from './reducer'
import type { EventAction } from './reducer'
import { StepDate } from './step-date'
import { StepDescription } from './step-description'
import { StepPreview } from './step-preview'
import { StepTime } from './step-time'
import { StepTitle } from './step-title'
import { StepType } from './step-type'

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
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })

  const iconSize = matches ? 18 : 34

  const submit = () => {
    fetcher.submit(eventStateToSubmittable(state), {
      method: 'post',
    })
  }

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
      <Container p={{ base: 1, sm: 'xs' }}>
        <Stepper
          allowNextStepsSelect={false}
          color={state.kind === 'edit' ? 'dtPink.4' : 'blue'}
          iconSize={iconSize}
          active={state.activeStep}
          onStepClick={(stepIndex: number) => {
            if (!isStepNumber(stepIndex)) {
              throw new Error('Not in step range')
            }
            dispatch({ kind: 'step', step: stepIndex })
          }}
        >
          <Stepper.Step icon={<IconRun />} data-testid="step-type">
            <StepType state={state} dispatch={dispatch} />
          </Stepper.Step>
          <Stepper.Step icon={<IconEdit />} data-testid="step-basic-info">
            <StepTitle state={state} dispatch={dispatch} />
          </Stepper.Step>
          <Stepper.Step icon={<IconCalendar />} data-testid="step-date">
            <StepDate state={state} dispatch={dispatch} />
          </Stepper.Step>
          <Stepper.Step icon={<IconClockHour5 />} data-testid="step-time">
            <StepTime state={state} dispatch={dispatch} />
          </Stepper.Step>
          <Stepper.Step icon={<IconAlignLeft />} data-testid="step-description">
            <StepDescription state={state} dispatch={dispatch} />
          </Stepper.Step>
          <Stepper.Step icon={<IconRocket />} data-testid="step-preview">
            <ParticipatingContext.Provider value={participatingActions}>
              <StepPreview
                state={state}
                me={me}
                dispatch={dispatch}
                submit={submit}
                submitState={fetcher.state}
              />
            </ParticipatingContext.Provider>
          </Stepper.Step>
        </Stepper>
      </Container>
    </>
  )
}
