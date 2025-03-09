import { Group } from '@mantine/core'
import { MonthPicker } from '@mantine/dates'
import type { ChallengeReducerProps } from '~/routes-common/challenges/create-edit/challenge-reducer'
import styles from './month-picker.module.css'

export const ChallengeDate = ({ state, dispatch }: ChallengeReducerProps) => {
  return (
    <Group justify="center">
      <MonthPicker
        locale="fi"
        value={state.date}
        onChange={(value) => {
          if (value == null) {
            return
          }
          dispatch({ kind: 'date', value })
        }}
        minDate={state.minDate}
        classNames={{
          monthsListControl: styles.selected,
        }}
      />
    </Group>
  )
}
