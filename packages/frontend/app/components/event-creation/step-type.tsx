import { Button, SimpleGrid } from '@mantine/core'
import { Gradient } from '~/components/colors'
import { EventType } from '~/gql/types.gen'
import { mapToData } from '~/util/event-type'

interface Properties {
  selectedEventType: EventType | undefined
  onSelect: (eventType: EventType) => void
}

export const StepType = ({ selectedEventType, onSelect }: Properties) => {
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
          color={selectedEventType === type ? 'dtPink' : 'blue'}
          key={type}
          onClick={() => {
            onSelect(type)
          }}
          variant="gradient"
          gradient={
            selectedEventType === type
              ? Gradient.dtPink
              : {
                  from: 'indigo',
                  to: 'cyan',
                  deg: Math.floor(Math.random() * 360),
                }
          }
        >
          {text}
        </Button>
      )
    })

  return <SimpleGrid cols={2}>{buttons}</SimpleGrid>
}
