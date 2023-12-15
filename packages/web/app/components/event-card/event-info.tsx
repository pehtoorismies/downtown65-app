import { Grid, Group, Text } from '@mantine/core'
import React from 'react'
import { ToggleJoinButton } from '~/components/event-card/toggle-join-button'
import { useUserContext } from '~/contexts/user-context'
import type { User } from '~/domain/user'

interface Props {
  id?: string

  subtitle: string
  location: string
  dateStart: string
  timeStart?: string | null
  participants: User[]
}

export const EventInfo = ({
  id,
  subtitle,
  dateStart,
  timeStart,
  location,
  participants,
}: Props) => {
  const { user } = useUserContext()

  const meAttending =
    user != null && participants.map(({ id }) => id).includes(user.id)

  const time = timeStart ? `klo ${timeStart}` : ''

  return (
    <Grid align="center" my={2} gutter="xs">
      <Grid.Col span={7}>
        <Text fw={700} mt={2} data-testid="event-subtitle">
          {subtitle}
        </Text>
        <Text size="sm" fw={500} data-testid="event-date">
          {dateStart} {time}
        </Text>
        <Text size="sm" c="dimmed" fw={400} data-testid="event-location">
          {location}
        </Text>
      </Grid.Col>
      <Grid.Col span={5}>
        <Group justify="end">
          <ToggleJoinButton isParticipating={meAttending} id={id} />
        </Group>
      </Grid.Col>
    </Grid>
  )
}
