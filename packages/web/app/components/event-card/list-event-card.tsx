import type { EventType } from '@downtown65-app/graphql/graphql'
import { Button, Grid, Group, Text } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconArrowNarrowRight } from '@tabler/icons-react'
import React from 'react'
import { ToggleJoinButton } from '~/components/toggle-join-button'
import { Voucher } from '~/components/voucher/voucher'
import { useUserContext } from '~/contexts/user-context'
import { mapToData } from '~/util/event-type'

interface Props {
  eventId: string
  title: string
  race: boolean
  subtitle: string
  location: string
  type: EventType
  createdBy: {
    nickname: string
  }
  participants: { id: string }[]
  dateStart: string
  timeStart?: string | null
}

export const ListEventCard = ({
  eventId,
  title,
  race,
  subtitle,
  location,
  type,
  createdBy,
  participants,
  dateStart,
  timeStart,
}: Props) => {
  const { user } = useUserContext()

  const meAttending =
    user != null && participants.map(({ id }) => id).includes(user.id)

  const time = timeStart ? `klo ${timeStart}` : ''

  return (
    <Voucher>
      <Voucher.Header bgImageUrl={mapToData(type).imageUrl}>
        <Voucher.Header.Title>{title}</Voucher.Header.Title>
        <Voucher.Header.ParticipantCount participants={participants} />
        <Voucher.Header.Creator nick={createdBy.nickname} />
        {race && <Voucher.Header.Competition />}
      </Voucher.Header>
      <Voucher.Content>
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
              <ToggleJoinButton isParticipating={meAttending} id={eventId} />
            </Group>
          </Grid.Col>
        </Grid>
        <Button
          component={Link}
          to={`/events/${eventId}`}
          fullWidth
          my="xs"
          size="compact-sm"
          rightSection={<IconArrowNarrowRight size={18} />}
          variant="subtle"
        >
          Näytä lisää
        </Button>
      </Voucher.Content>
    </Voucher>
  )
}
