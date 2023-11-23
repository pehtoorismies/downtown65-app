import { TextInput } from '@mantine/core'
import type { ChallengeReducerProps } from '~/routes-common/challenges/create-edit/challenge-reducer'

const SPACING = 'md'

export const ChallengeTitle = ({ state, dispatch }: ChallengeReducerProps) => {
  return (
    <>
      <TextInput
        name="title"
        my={SPACING}
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
        my={SPACING}
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
