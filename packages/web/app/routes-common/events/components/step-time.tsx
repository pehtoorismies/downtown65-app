import 'dayjs/locale/fi'
import { Button, Center, Grid, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { PropsWithChildren } from 'react'
import React from 'react'
import type { EventState } from './event-state'
import type { ReducerProps } from './reducer'
import { Gradient } from '~/components/colors'
import {
  NextButton,
  PrevButton,
  StepLayout,
} from '~/routes-common/events/components/step-layout'
import { prefixZero, suffixZero } from '~/util/pad-zeros'

const HOURS = [
  [6, 7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20, 21],
  [22, 23, 0, 1, 2, 3, 4, 5],
]

const MINUTES = [
  [0, 5, 10, 15, 20, 25],
  [30, 35, 40, 45, 50, 55],
]

const getGradient = (currentValue: number, value?: number) => {
  if (value === currentValue) {
    return Gradient.dtPink
  }
  return { from: 'blue', to: 'blue', deg: 45 }
}

const getTime = ({ time }: EventState): string => {
  if (time.hours !== undefined && time.minutes !== undefined) {
    return `: ${prefixZero(time.hours)}:${suffixZero(time.minutes)}`
  }
  if (time.hours !== undefined) {
    return `: ${prefixZero(time.hours)}:xx`
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
        gradient={getGradient(hour, state.time.hours)}
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
        {prefixZero(hour)}
      </Button>
    ))
  const getMinutesCol = (minutes: number[]) =>
    minutes.map((minute) => (
      <Button
        variant="gradient"
        gradient={getGradient(minute, state.time.minutes)}
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
        {suffixZero(minute)}
      </Button>
    ))

  const previousButton = (
    <PrevButton onClick={() => dispatch({ kind: 'previousStep' })}>
      Päivämäärä
    </PrevButton>
  )
  const nextButton = (
    <NextButton onClick={() => dispatch({ kind: 'nextStep' })}>
      Kuvaus
    </NextButton>
  )

  const gap = matches ? 5 : 'sm'

  return (
    <StepLayout
      title={`Kellon aika${getTime(state)}`}
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
