import { Group } from '@mantine/core'
import type { DateValue } from '@mantine/dates'
import { DatePicker } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import { format } from 'date-fns'
import type { ReducerProps } from './reducer'
import {
  NextButton,
  PreviousButton,
  StepLayout,
} from '~/routes-common/events/components/step-layout'

export const StepDate = ({ state, dispatch }: ReducerProps) => {
  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })

  const size = matches ? 'sm' : 'lg'

  const previousButton = (
    <PreviousButton onClick={() => dispatch({ kind: 'previousStep' })}>
      Perustiedot
    </PreviousButton>
  )
  const nextButton = (
    <NextButton onClick={() => dispatch({ kind: 'nextStep' })}>
      Kellonaika
    </NextButton>
  )

  return (
    <StepLayout
      prevButton={previousButton}
      nextButton={nextButton}
      title={`Päivämäärä: ${format(state.date, 'd.M.yyyy')}`}
    >
      <Group justify="center">
        <DatePicker
          minDate={state.kind === 'create' ? new Date() : undefined}
          value={state.date}
          defaultDate={state.date}
          onChange={(date: DateValue) => {
            if (date == null) {
              throw new Error('Date can not be null')
            }

            dispatch({ kind: 'date', date })
          }}
          numberOfColumns={1}
          size={size}
          locale="fi"
        />
      </Group>
    </StepLayout>
  )
}
