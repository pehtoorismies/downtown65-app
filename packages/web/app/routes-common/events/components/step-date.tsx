import 'dayjs/locale/fi'
import { Group } from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import { DatePicker } from '@mantine/dates'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import type { ReducerProps } from './reducer'
import {
  NextButton,
  PrevButton,
  StepLayout,
} from '~/routes-common/events/components/buttons'

export const StepDate = ({ state, dispatch }: ReducerProps) => {
  const previousButton = (
    <PrevButton onClick={() => dispatch({ kind: 'previousStep' })}>
      Perustiedot
    </PrevButton>
  )
  const nextButton = (
    <NextButton onClick={() => dispatch({ kind: 'nextStep' })}>
      Kuvaus
    </NextButton>
  )

  return (
    <StepLayout
      prevButton={previousButton}
      nextButton={nextButton}
      title={`Päivämäärä: ${format(state.date, 'dd.MM.yyyy')}`}
    >
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
    </StepLayout>
  )
}
