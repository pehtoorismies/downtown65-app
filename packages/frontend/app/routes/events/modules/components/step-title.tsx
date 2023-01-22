import { Center, TextInput, Switch } from '@mantine/core'
import type { ReducerProps } from '~/routes/events/modules/components/reducer'

const spacing = 'md'

export const StepTitle = ({ state, dispatch }: ReducerProps) => {
  return (
    <>
      <TextInput
        name="title"
        my={spacing}
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
        name="subtitle"
        my={spacing}
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
        name="location"
        my={spacing}
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
          data-testid="race-switch"
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
