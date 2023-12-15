import 'dayjs/locale/fi'
import { Group } from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import { DatePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import type { ReducerProps } from './reducer'
import { Heading } from '~/routes-common/events/components/heading'

export const StepDate = ({ state, dispatch }: ReducerProps) => {
  return (
    <>
      <Heading>Päivämäärä</Heading>
      <Group justify="center">
        <DatePicker
          minDate={dayjs(new Date()).toDate()}
          value={state.date}
          onChange={(date: DateValue) => {
            if (date == null) {
              throw new Error('Date can not be null')
            }

            dispatch({ kind: 'date', date })
          }}
          numberOfColumns={1}
          size="md"
          locale="fi"
        />
      </Group>
    </>
  )
}
