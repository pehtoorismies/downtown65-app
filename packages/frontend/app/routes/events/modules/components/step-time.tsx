import 'dayjs/locale/fi'
import { Center, Button, Text, Grid, Stack, Container } from '@mantine/core'
import type { EventState } from '~/routes/events/modules/components/event-state'
import type { ReducerProps } from '~/routes/events/modules/components/reducer'
import { prefixZero, suffixZero } from '~/util/pad-zeros'

const HOURS = [
  [6, 9, 12, 15, 18, 21, 0, 3],
  [7, 10, 13, 16, 19, 22, 1, 4],
  [8, 11, 14, 17, 20, 23, 2],
]

const MINUTES = [
  [0, 10, 20, 30, 40, 50],
  [5, 15, 25, 35, 45, 55],
]

const getHighlightColor = (
  mainColor: string,
  highliteColor: string,
  currentValue: number,
  value?: number
) => {
  if (value === currentValue) {
    return highliteColor
  }

  return mainColor
}

const getTime = ({ time }: EventState): string => {
  if (time.hours !== undefined && time.minutes !== undefined) {
    return `${prefixZero(time.hours)}:${suffixZero(time.minutes)}`
  }
  if (time.hours !== undefined) {
    return `${prefixZero(time.hours)}:xx`
  }
  return 'ei aikaa'
}

export const StepTime = ({ state, dispatch }: ReducerProps) => {
  const getHoursCol = (hours: number[]) =>
    hours.map((hour) => (
      <Button
        color={getHighlightColor('blue', 'dtPink.4', hour, state.time.hours)}
        key={hour}
        radius="xs"
        size="xs"
        compact
        onClick={() => {
          dispatch({
            kind: 'time',
            time: {
              ...state.time,
              hours: hour,
            },
          })
        }}
        data-cy={`hour-${prefixZero(hour)}`}
      >
        {prefixZero(hour)}
      </Button>
    ))
  const getMinutesCol = (minutes: number[]) =>
    minutes.map((minute) => (
      <Button
        color={getHighlightColor(
          'blue',
          'dtPink.4',
          minute,
          state.time.minutes
        )}
        disabled={state.time.hours === undefined}
        key={minute}
        radius="xs"
        size="xs"
        compact
        onClick={() => {
          dispatch({
            kind: 'time',
            time: {
              ...state.time,
              minutes: minute,
            },
          })
        }}
        data-cy={`minute-${suffixZero(minute)}`}
      >
        {suffixZero(minute)}
      </Button>
    ))

  return (
    <Container>
      <Grid gutter="xs" mt="sm">
        <Grid.Col span={6}>
          <Text size="sm">Tunnit</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm">Minuutit</Text>
        </Grid.Col>
      </Grid>

      <Grid gutter="xs">
        <Grid.Col span={2}>
          <Stack spacing="xs">{getHoursCol(HOURS[0])}</Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Stack spacing="xs">{getHoursCol(HOURS[1])}</Stack>
        </Grid.Col>
        <Grid.Col span={2}>
          <Stack spacing="xs">{getHoursCol(HOURS[2])}</Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack spacing="xs">{getMinutesCol(MINUTES[0])}</Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack spacing="xs">{getMinutesCol(MINUTES[1])}</Stack>
        </Grid.Col>
      </Grid>
      <Center>
        <Button
          data-cy="clear-time"
          mt="md"
          variant="outline"
          compact
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
      <Text align="center" fz="xl" fw={700} mt="md" data-cy="time-display">
        {getTime(state)}
      </Text>
    </Container>
  )
}
