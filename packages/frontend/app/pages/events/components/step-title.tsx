import { Center, TextInput, Text, Switch } from '@mantine/core'
import type { ReducerProps } from '~/pages/events/components/reducer'
import { mapToData } from '~/util/event-type'

export const StepTitle = ({ state, dispatch }: ReducerProps) => {
  return (
    <>
      {state.eventType && (
        <Text my="xs">
          Tarkenteet tapahtumalle: {mapToData(state.eventType).text}{' '}
        </Text>
      )}
      <TextInput
        placeholder="Jukola Konala"
        label="Tapahtuman nimi"
        size="lg"
        withAsterisk
        onChange={(event) =>
          dispatch({ kind: 'title', title: event.target.value })
        }
        value={state.title}
      />
      <TextInput
        placeholder="6-7 joukkuetta"
        label="Tarkenne"
        size="lg"
        withAsterisk
        onChange={(event) =>
          dispatch({ kind: 'subtitle', subtitle: event.target.value })
        }
        value={state.subtitle}
      />
      <TextInput
        placeholder="Sijainti"
        label="Missä tapahtuma järjestetään?"
        size="lg"
        withAsterisk
        onChange={(event) =>
          dispatch({ kind: 'location', location: event.target.value })
        }
        value={state.location}
      />
      <Center>
        <Switch
          onLabel="ON"
          offLabel="EI"
          size="xl"
          labelPosition="left"
          label="Onko kilpailu?"
          onChange={(event) => {
            dispatch({ kind: 'race', isRace: event.currentTarget.checked })
          }}
          checked={state.isRace}
        />
      </Center>
    </>
  )
}
