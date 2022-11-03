import format from 'date-fns/format'
import { fi } from 'date-fns/locale'

const onlyDateRegexp = /^\d{4}-\d{2}-\d{2}$/

const formatTime = (date: string): string | undefined => {
  if (onlyDateRegexp.test(date)) {
    return
  }
  return format(new Date(date), `HH:mm`, {
    locale: fi,
  })
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd.MM.yyyy (EEEEEE)', {
    locale: fi,
  })
}

export const formatDynamoDate = (
  dynamoDate: string
): { time: string | undefined; date: string } => {
  return {
    date: formatDate(dynamoDate),
    time: formatTime(dynamoDate),
  }
}
