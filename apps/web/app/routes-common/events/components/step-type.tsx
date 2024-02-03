import { Button, SimpleGrid } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { ReducerProps } from './reducer'
import { Gradient } from '~/components/colors'
import { EventType } from '~/generated/graphql'
import {
  NextButton,
  StepLayout,
} from '~/routes-common/events/components/step-layout'
import { mapToData } from '~/util/event-type'

export const StepType = ({ state, dispatch }: ReducerProps) => {
  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })
  const size = matches ? 'xs' : 'sm'

  const buttons = Object.values(EventType)
    .map((v) => {
      return {
        type: v,
        ...mapToData(v),
      }
    })
    .sort((a, b) => {
      const aValue = a.text.toLowerCase()
      const bValue = b.text.toLowerCase()
      if (aValue < bValue) {
        return -1
      }
      if (bValue < aValue) {
        return 1
      }
      return 0
    })
    .map(({ text, type, icon }) => {
      return (
        <Button
          data-testid={
            state.eventType === type
              ? `button-${type}-selected`
              : `button-${type}`
          }
          color={state.eventType === type ? 'dtPink' : 'blue'}
          key={type}
          onClick={() => {
            dispatch({ kind: 'type', type })
          }}
          leftSection={icon}
          rightSection={<span />}
          justify="space-between"
          variant="gradient"
          size={size}
          gradient={
            state.eventType === type
              ? Gradient.dtPink
              : {
                  from: 'indigo',
                  to: 'cyan',
                  deg: 45,
                }
          }
        >
          {text}
        </Button>
      )
    })

  const nextButton = state.eventType ? (
    <NextButton onClick={() => dispatch({ kind: 'nextStep' })}>
      Perustiedot
    </NextButton>
  ) : null

  return (
    <StepLayout prevButton={null} nextButton={nextButton} title="Laji">
      <SimpleGrid cols={2} spacing={{ base: 'xs', sm: 'md' }}>
        {buttons}
      </SimpleGrid>
    </StepLayout>
  )
}
