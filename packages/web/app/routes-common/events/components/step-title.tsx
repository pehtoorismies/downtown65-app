import { Center, Switch, TextInput } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { ReducerProps } from './reducer'
import { Heading } from '~/routes-common/events/components/heading'

const spacing = 'md'

export const StepTitle = ({ state, dispatch }: ReducerProps) => {
  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })

  const size = matches ? 'md' : 'lg'
  const switchSize = matches ? 'md' : 'lg'

  return (
    <>
      <Heading>Perustiedot</Heading>
      <TextInput
        name="title"
        my={spacing}
        placeholder="Jukola Konala"
        label="Tapahtuman nimi"
        size={size}
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
        size={size}
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
        size={size}
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
          size={switchSize}
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
