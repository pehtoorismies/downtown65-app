import format from 'date-fns/format'
import fi from 'date-fns/locale/fi'
import parse from 'date-fns/parse'

export const formatDate = (dbDateFormat: string) => {
  const date = parse(dbDateFormat, 'yyyy-MM-dd', new Date())
  return format(date, `dd.MM.yyyy (E)`, { locale: fi })
}
