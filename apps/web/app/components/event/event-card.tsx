import type { EventType } from '~/generated/graphql'
import {
  Divider,
  Grid,
  Group,
  Text,
  TypographyStylesProvider,
} from '@mantine/core'
import { IconMedal } from '@tabler/icons-react'
import React from 'react'
import { Participants } from '~/components/participants'
import { ToggleJoinButton } from '~/components/toggle-join-button'
import { Voucher } from '~/components/voucher/voucher'
import { useParticipantsCount } from '~/hooks/use-participants-count'
import { mapToData } from '~/util/event-type'

interface Props {
  eventId?: string
  title: string
  race: boolean
  subtitle: string
  location: string
  type: EventType
  createdBy: {
    nickname: string
  }
  participants: {
    id: string
    nickname: string
    picture: string
  }[]
  dateStart: string
  timeStart?: string | null
  description?: string
}

const getDescription = (description: string | undefined) => {
  if (description && description.trim().length > 0) {
    return description.trim()
  }
}

export const EventCard = ({
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
  description,
}: Props) => {
  const { count, meAttending } = useParticipantsCount(participants)

  const time = timeStart ? `klo ${timeStart}` : ''
  const descriptionText = getDescription(description)

  const formattedDate = time.length === 0 ? dateStart : `${dateStart} ${time}`

  return (
    <Voucher>
      <Voucher.Header bgImageUrl={mapToData(type).imageUrl}>
        <Voucher.Header.Title>{title}</Voucher.Header.Title>
        <Voucher.Header.ParticipantCount
          count={count}
          highlighted={meAttending}
        />
        <Voucher.Header.Type type={mapToData(type).text} />
        <Voucher.Header.Creator nick={createdBy.nickname} />
        {race && <Voucher.Header.Icon icon={<IconMedal color="white" />} />}
      </Voucher.Header>
      <Voucher.Content>
        <Grid align="center" my={2} gutter="xs">
          <Grid.Col span={7}>
            <Text fw={700} mt={2} data-testid="event-subtitle">
              {subtitle}
            </Text>
            <Text size="sm" fw={500} data-testid="event-date">
              {formattedDate}
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
        <Divider my="xs" label="Osallistujat" labelPosition="center" />
        <Participants participants={participants} />
        <Divider my="xs" label="Lisätiedot" labelPosition="center" />
        {descriptionText ? (
          <TypographyStylesProvider p={0} mt="sm">
            <div dangerouslySetInnerHTML={{ __html: descriptionText }} />
          </TypographyStylesProvider>
        ) : (
          <Text ta="center" p="sm" c="dimmed" fw={400}>
            ei tarkempaa tapahtuman kuvausta
          </Text>
        )}
      </Voucher.Content>
    </Voucher>
  )
}
