import { Button, SimpleGrid } from '@mantine/core'
import type { ReducerProps } from './reducer'
import { Gradient } from '~/components/colors'
import { EventType } from '~/gql/types.gen'
import { mapToData } from '~/util/event-type'

export const StepType = ({ state, dispatch }: ReducerProps) => {
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
    .map(({ text, type }) => {
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
          variant="gradient"
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

  return <SimpleGrid cols={2}>{buttons}</SimpleGrid>
}
