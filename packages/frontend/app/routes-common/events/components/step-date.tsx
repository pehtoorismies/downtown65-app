import 'dayjs/locale/fi'
import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'
import type { ReducerProps } from './reducer'

export const StepDate = ({ state, dispatch }: ReducerProps) => {
  return (
    <Calendar
      minDate={dayjs(new Date()).toDate()}
      value={state.date}
      initialMonth={state.date}
      onChange={(date: Date) => {
        dispatch({ kind: 'date', date })
      }}
      fullWidth
      size="md"
      allowLevelChange={false}
      locale="fi"
    />
  )
}
