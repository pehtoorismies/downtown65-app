import 'dayjs/locale/fi'
import { Calendar } from '@mantine/dates'
import type { ReducerProps } from '~/pages/events/components/reducer'

export const StepDate = ({ state, dispatch }: ReducerProps) => {
  return (
    <Calendar
      value={state.date}
      onChange={(date: Date) => {
        dispatch({ kind: 'date', date })
      }}
      fullWidth
      size="md"
      allowLevelChange={false}
      disableOutsideEvents
      locale="fi"
    />
  )
}
