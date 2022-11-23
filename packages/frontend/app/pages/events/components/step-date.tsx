import 'dayjs/locale/fi'
import { Calendar } from '@mantine/dates'

interface Properties {
  date?: Date
  onSetDate: (date: Date) => void
}

export const StepDate = ({ date, onSetDate }: Properties) => {
  return (
    <Calendar
      value={date}
      onChange={onSetDate}
      fullWidth
      size="md"
      allowLevelChange={false}
      disableOutsideEvents
      locale="fi"
    />
  )
}
