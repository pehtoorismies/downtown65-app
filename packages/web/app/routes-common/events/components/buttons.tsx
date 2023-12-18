import type { ButtonProps } from '@mantine/core'
import { Button, Grid, Group, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { Icon } from '@tabler/icons-react'
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconDeviceFloppy,
} from '@tabler/icons-react'
import type { PropsWithChildren, ReactNode } from 'react'
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
  NextIcon: Icon
  isNextVisible: boolean
  isPreviousVisible: boolean
}

const getNextStuff = (
  kind: EventState['kind']
): { nextTitle: string; NextIcon: Icon } => {
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
    case ActiveStep.STEP_PREVIEW: {
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
  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })
  const size = matches ? 'xs' : 'sm'

  const isReviewStep = state.activeStep === ActiveStep.STEP_PREVIEW

  const { nextTitle, prevTitle, NextIcon, isNextVisible, isPreviousVisible } =
    getButtonAttributes(state)

  return (
    <>
      <Grid justify="center" mt="xl">
        <Grid.Col span={6}>
          {isPreviousVisible && (
            <Button
              size={size}
              data-testid="prev-button"
              mt="xs"
              leftSection={<IconArrowLeft size={18} />}
              onClick={onPreviousStep}
            >
              {prevTitle}
            </Button>
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          {isNextVisible && (
            <Group justify="right">
              <Button
                data-testid="next-button"
                mt="xs"
                rightSection={<NextIcon size={18} />}
                color={isReviewStep ? 'dtPink.3' : 'blue'}
                onClick={onNextStep}
                size={size}
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

interface ButtonLayout {
  prevButton: ReactNode
  nextButton: ReactNode
  title: string
}

export const StepLayout = ({
  prevButton,
  nextButton,
  title,
  children,
}: PropsWithChildren<ButtonLayout>) => {
  return (
    <>
      <Title ta="center" order={2} size="h3" mb="xs">
        {title}
      </Title>
      {children}
      <Grid justify="center" mt="xl">
        <Grid.Col span={6}>{prevButton}</Grid.Col>
        <Grid.Col span={6}>
          <Group justify="right">{nextButton}</Group>
        </Grid.Col>
      </Grid>
    </>
  )
}

interface ProgressButtonProps {
  onClick: () => void
}

export const ProgressButton = (
  props: PropsWithChildren<ProgressButtonProps & ButtonProps>
) => {
  const { children, ...rest } = props

  return (
    <>
      <Button
        {...rest}
        data-testid="prev-button"
        mt="xs"
        hiddenFrom="sm"
        size="xs"
      >
        {children}
      </Button>
      <Button
        {...rest}
        data-testid="prev-button"
        mt="xs"
        visibleFrom="sm"
        size="sm"
      >
        {children}
      </Button>
    </>
  )
}
