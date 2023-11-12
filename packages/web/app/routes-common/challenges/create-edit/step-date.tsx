import 'dayjs/locale/fi'
import { Group } from '@mantine/core'
import { MonthPicker } from '@mantine/dates'
import styles from './month-picker.module.css'
import type { ReducerProps } from '~/routes-common/challenges/create-edit/reducer'

export const StepDate = ({ state, dispatch }: ReducerProps) => {
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
      ></MonthPicker>
    </Group>
  )
}
