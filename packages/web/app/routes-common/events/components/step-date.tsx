import 'dayjs/locale/fi'
import { Group } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import type { ReducerProps } from './reducer'

export const StepDate = ({ state, dispatch }: ReducerProps) => {
  return (
    <Group justify="center">
      <DatePicker
        minDate={dayjs(new Date()).toDate()}
        value={state.date}
        onChange={(date: Date) => {
          dispatch({ kind: 'date', date })
        }}
        numberOfColumns={1}
        size="md"
        locale="fi"
      />
    </Group>
  )
}
