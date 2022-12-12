import { Button, Grid, Group } from '@mantine/core'
import type { TablerIcon } from '@tabler/icons'
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconDeviceFloppy,
} from '@tabler/icons'
import type { EventState } from './event-state'
import { ActiveStep } from './reducer'

interface Props {
  state: EventState
  onNextStep: () => void
  onPreviousStep: () => void
}

type ButtonAttributes = {
  nextTitle: string
  prevTitle: string
  NextIcon: TablerIcon
  isNextVisible: boolean
  isPreviousVisible: boolean
}

const getNextStuff = (
  kind: EventState['kind']
): { nextTitle: string; NextIcon: TablerIcon } => {
  switch (kind) {
    case 'create': {
      return {
        nextTitle: 'Luo tapahtuma',
        NextIcon: IconArrowUp,
      }
    }
    case 'edit': {
      return {
        nextTitle: 'Tallenna',
        NextIcon: IconDeviceFloppy,
      }
    }
  }
}

const getButtonAttributes = (state: EventState): ButtonAttributes => {
  switch (state.activeStep) {
    case ActiveStep.STEP_EVENT_TYPE: {
      return {
        nextTitle: 'Perustiedot',
        prevTitle: '',
        NextIcon: IconArrowRight,
        isNextVisible: !!state.eventType,
        isPreviousVisible: false,
      }
    }
    case ActiveStep.STEP_TITLE: {
      return {
        nextTitle: 'Päivämäärä',
        prevTitle: 'Tyyppi',
        NextIcon: IconArrowRight,
        isNextVisible: !!state.title && !!state.location && !!state.subtitle,
        isPreviousVisible: true,
      }
    }
    case ActiveStep.STEP_DATE: {
      return {
        nextTitle: 'Kellonaika',
        prevTitle: 'Perustiedot',
        NextIcon: IconArrowRight,
        isNextVisible: true,
        isPreviousVisible: true,
      }
    }
    case ActiveStep.STEP_TIME: {
      return {
        nextTitle: 'Vapaa kuvaus',
        prevTitle: 'Päivämäärä',
        NextIcon: IconArrowRight,
        isNextVisible: true,
        isPreviousVisible: true,
      }
    }
    case ActiveStep.STEP_DESCRIPTION: {
      return {
        nextTitle: 'Esikatselu',
        prevTitle: 'Kellonaika',
        NextIcon: IconArrowRight,
        isNextVisible: true,
        isPreviousVisible: true,
      }
    }
    case ActiveStep.STEP_REVIEW: {
      return {
        prevTitle: 'Vapaa kuvaus',
        isNextVisible: true,
        isPreviousVisible: true,
        ...getNextStuff(state.kind),
      }
    }
  }
}

export const Buttons = ({ state, onPreviousStep, onNextStep }: Props) => {
  const isReviewStep = state.activeStep === ActiveStep.STEP_REVIEW

  const { nextTitle, prevTitle, NextIcon, isNextVisible, isPreviousVisible } =
    getButtonAttributes(state)

  return (
    <>
      <Grid justify="center" mt="xl">
        <Grid.Col span={6}>
          {isPreviousVisible && (
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
              {prevTitle}
            </Button>
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          {isNextVisible && (
            <Group position="right">
              <Button
                mt="xs"
                rightIcon={<NextIcon size={18} />}
                styles={() => ({
                  leftIcon: {
                    marginRight: 15,
                  },
                })}
                color={isReviewStep ? 'dtPink.3' : 'blue'}
                onClick={onNextStep}
              >
                {nextTitle}
              </Button>
            </Group>
          )}
        </Grid.Col>
      </Grid>
    </>
  )
}
