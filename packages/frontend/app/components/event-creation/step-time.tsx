import 'dayjs/locale/fi'
import {
  Center,
  Title,
  Button,
  Text,
  Grid,
  Stack,
  Container,
  Group,
} from '@mantine/core'
import { prefixZero, suffixZero } from '~/components/event-creation/pad-zeros'

const HOURS = [
  [6, 9, 12, 15, 18, 21, 0, 3],
  [7, 10, 13, 16, 19, 22, 1, 4],
  [8, 11, 14, 17, 20, 23, 2, 4],
]

const MINUTES = [
  [0, 10, 20, 30, 40, 50],
  [5, 15, 25, 35, 45, 55],
]

interface Time {
  hours?: number
  minutes?: number
}

const getHighlightColor = (
  mainColor: string,
  highliteColor: string,
  currentValue: number,
  value?: number
) => {
  if (value === currentValue) {
    return highliteColor
  }
  // if (value !== undefined) {
  //   return 'blue.5'
  // }
  return mainColor
}

interface Properties {
  time: Time
  onSetTime: (time: Time) => void
}

export const StepTime = ({ time, onSetTime }: Properties) => {
  const getHoursCol = (hours: number[]) =>
    hours.map((hour) => (
      <Button
        color={getHighlightColor('blue', 'dtPink', hour, time.hours)}
        key={hour}
        radius="xs"
        size="xs"
        compact
        onClick={() => {
          onSetTime({
            ...time,
            hours: hour,
          })
        }}
      >
        {prefixZero(hour)}
      </Button>
    ))
  const getMinutesCol = (minutes: number[]) =>
    minutes.map((minute) => (
      <Button
        color={getHighlightColor('teal', 'dtPink', minute, time.minutes)}
        disabled={time.hours === undefined}
        key={minute}
        radius="xs"
        size="xs"
        compact
        onClick={() => {
          onSetTime({
            ...time,
            minutes: minute,
          })
        }}
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
        <Button mt="md" variant="outline" compact onClick={() => onSetTime({})}>
          Tyhjennä aika
        </Button>
      </Center>
    </Container>
  )
}
