import { Button, Grid, Group } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons'
import type { State } from '~/components/event-creation/creation-reducers'
import { ActiveStep } from '~/components/event-creation/creation-reducers'

const isNextVisible = (state: State): boolean => {
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

const isPreviousVisible = (state: State): boolean =>
  state.activeStep !== ActiveStep.STEP_EVENT_TYPE

interface Properties {
  state: State
  onNextStep: () => void
  onPreviousStep: () => void
}

export const Buttons = ({ state, onPreviousStep, onNextStep }: Properties) => {
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
                {isReviewStep ? 'Luo tapahtuma' : 'Seuraava'}
              </Button>
            </Group>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}
