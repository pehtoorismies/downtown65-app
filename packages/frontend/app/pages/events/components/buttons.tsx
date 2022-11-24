import { Button, Grid, Group } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons'
import type { EventState } from './event-state'
import { ActiveStep } from './reducer'

const isNextVisible = (state: EventState): boolean => {
  switch (state.activeStep) {
    case ActiveStep.STEP_EVENT_TYPE: {
      return !!state.eventType
    }
    case ActiveStep.STEP_TITLE: {
      return !!state.title && !!state.location
    }
    case ActiveStep.STEP_DATE: {
      return !!state.date
    }
    case ActiveStep.STEP_TIME: {
      return true
    }
    case ActiveStep.STEP_DESCRIPTION: {
      return true
    }
    case ActiveStep.STEP_REVIEW: {
      return true
    }
  }
}

const isPreviousVisible = (state: EventState): boolean =>
  state.activeStep !== ActiveStep.STEP_EVENT_TYPE

interface Props {
  state: EventState
  onNextStep: () => void
  onPreviousStep: () => void
}

const getNextButtonText = (state: EventState): string => {
  const isReviewStep = state.activeStep === ActiveStep.STEP_REVIEW
  if (!isReviewStep) {
    return 'Seuraava'
  }
  switch (state.kind) {
    case 'create': {
      return 'Luo tapahtuma'
    }
    case 'edit': {
      return 'Tallenna'
    }
  }
}

export const Buttons = ({ state, onPreviousStep, onNextStep }: Props) => {
  const isReviewStep = state.activeStep === ActiveStep.STEP_REVIEW

  return (
    <>
      <Grid justify="center" mt="xl">
        <Grid.Col span={6}>
          {isPreviousVisible(state) && (
            <Button
              mt="xs"
              leftIcon={<IconArrowLeft size={18} />}
              styles={() => ({
                leftIcon: {
                  marginRight: 15,
                },
              })}
              onClick={onPreviousStep}
            >
              Edellinen
            </Button>
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          {isNextVisible(state) && (
            <Group position="right">
              <Button
                mt="xs"
                rightIcon={<IconArrowRight size={18} />}
                styles={() => ({
                  leftIcon: {
                    marginRight: 15,
                  },
                })}
                color={isReviewStep ? 'dtPink.3' : 'blue'}
                onClick={onNextStep}
              >
                {getNextButtonText(state)}
              </Button>
            </Group>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}
