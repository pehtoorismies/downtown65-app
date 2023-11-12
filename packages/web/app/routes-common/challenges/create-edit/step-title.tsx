import { TextInput } from '@mantine/core'
import type { ReducerProps } from '~/routes-common/challenges/create-edit/reducer'

const spacing = 'md'

export const StepTitle = ({ state, dispatch }: ReducerProps) => {
  return (
    <>
      <TextInput
        name="title"
        my={spacing}
        placeholder="Bissehaaste"
        label="Haasteen nimi"
        size="lg"
        withAsterisk
        value={state.title}
        onChange={(event) =>
          dispatch({ kind: 'title', value: event.target.value })
        }
      />
      <TextInput
        name="subtitle"
        my={spacing}
        placeholder="10 ipaa päivässä"
        label="Tarkenne"
        size="lg"
        withAsterisk
        value={state.subtitle}
        onChange={(event) =>
          dispatch({ kind: 'subtitle', value: event.target.value })
        }
      />
    </>
  )
}
