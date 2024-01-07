import 'dayjs/locale/fi'
import { padTime } from '@downtown65-app/core/time-functions'
import { Button, Center, Grid, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { PropsWithChildren } from 'react'
import React from 'react'
import type { EventState } from './event-state'
import type { ReducerProps } from './reducer'
import { Gradient, GradientInverse } from '~/components/colors'
import {
  NextButton,
  PreviousButton,
  StepLayout,
} from '~/routes-common/events/components/step-layout'

const HOURS = [
  [6, 9, 12, 15, 18, 21, 0, 3],
  [7, 10, 13, 16, 19, 22, 1, 4],
  [8, 11, 14, 17, 20, 23, 2, 5],
]

const MINUTES = [
  [0, 10, 20, 30, 40, 50],
  [5, 15, 25, 35, 45, 55],
]

const getHourGradient = (currentValue: number, value?: number) => {
  if (value === currentValue) {
    return Gradient.dtPink
  }
  return { from: 'blue.5', to: 'blue.5', deg: 45 }
}

const getMinuteGradient = (currentValue: number, value?: number) => {
  if (value === currentValue) {
    return GradientInverse.dtPink
  }
  return { from: 'violet.5', to: 'violet.5', deg: 45 }
}

const getTime = ({ time }: EventState): string => {
  if (time.hours !== undefined && time.minutes !== undefined) {
    return `: ${padTime(time.hours)}:${padTime(time.minutes)}`
  }
  if (time.hours !== undefined) {
    return `: ${padTime(time.hours)}:xx`
  }
  return ''
}

const ResponsiveText = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Text hiddenFrom="sm" size="sm">
        {children}
      </Text>
      <Text visibleFrom="sm" size="lg">
        {children}
      </Text>
    </>
  )
}

export const StepTime = ({ state, dispatch }: ReducerProps) => {
  const matches = useMediaQuery('(max-width: 48em)', true, {
    getInitialValueInEffect: false,
  })

  const size = matches ? 'compact-xs' : 'sm'
  const radius = matches ? 'xs' : 'sm'

  const getHoursCol = (hours: number[]) =>
    hours.map((hour) => (
      <Button
        gradient={getHourGradient(hour, state.time.hours)}
        variant="gradient"
        radius={radius}
        key={hour}
        size={size}
        onClick={() => {
          dispatch({
            kind: 'time',
            time: {
              ...state.time,
              hours: hour,
            },
          })
        }}
        data-testid={`hour-${hour}`}
      >
        {padTime(hour)}
      </Button>
    ))
  const getMinutesCol = (minutes: number[]) =>
    minutes.map((minute) => (
      <Button
        variant="gradient"
        gradient={getMinuteGradient(minute, state.time.minutes)}
        radius={radius}
        disabled={state.time.hours === undefined}
        key={minute}
        size={size}
        onClick={() => {
          dispatch({
            kind: 'time',
            time: {
              ...state.time,
              minutes: minute,
            },
          })
        }}
        data-testid={`minute-${minute}`}
      >
        {padTime(minute)}
      </Button>
    ))

  const previousButton = (
    <PreviousButton onClick={() => dispatch({ kind: 'previousStep' })}>
      Päivämäärä
    </PreviousButton>
  )
  const nextButton = (
    <NextButton onClick={() => dispatch({ kind: 'nextStep' })}>
      Kuvaus
    </NextButton>
  )

  const gap = matches ? 5 : 'sm'

  return (
    <StepLayout
      title={`Kellonaika${getTime(state)}`}
      nextButton={nextButton}
      prevButton={previousButton}
    >
      <Grid gutter={{ base: 2, xs: 2, sm: 'sm' }} mt="sm">
        <Grid.Col span={6}>
          <ResponsiveText>Tunnit</ResponsiveText>
        </Grid.Col>
        <Grid.Col span={6}>
          <ResponsiveText>Minuutit</ResponsiveText>
        </Grid.Col>
      </Grid>
      <Grid gutter="xs">
        <Grid.Col span={2}>
          <Stack gap={gap}>{getHoursCol(HOURS[0])}</Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Stack gap={gap}>{getHoursCol(HOURS[1])}</Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Stack gap={gap}>{getHoursCol(HOURS[2])}</Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack gap={gap}>{getMinutesCol(MINUTES[0])}</Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack gap={gap}>{getMinutesCol(MINUTES[1])}</Stack>
        </Grid.Col>
      </Grid>
      <Center>
        <Button
          data-testid="clear-time"
          mt="md"
          color="red"
          variant="outline"
          size={size}
          onClick={() =>
            dispatch({
              kind: 'time',
              time: {
                hours: undefined,
                minutes: undefined,
              },
            })
          }
        >
          Tyhjennä aika
        </Button>
      </Center>
    </StepLayout>
  )
}
