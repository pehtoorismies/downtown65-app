import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { IconCheck, IconCircle } from '@tabler/icons-react'
import { formatISO } from 'date-fns'
import React from 'react'
import { LeaderboardRow } from '~/components/challenge/leaderboard-row'
import { ToggleJoinButton } from '~/components/event-card/toggle-join-button'
import { Voucher } from '~/components/voucher/voucher'
import type { Context } from '~/contexts/participating-context'
import { ParticipatingContext } from '~/contexts/participating-context'
import type { ChallengeParticipant } from '~/domain/user'
import { loaderAuthenticate } from '~/session.server'
import { getChallengeDates } from '~/util/challenge-date'
import { logger } from '~/util/logger.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await loaderAuthenticate(request)

  const participants: ChallengeParticipant[] = [
    {
      ...user,
      doneDatesCount: 6,
    },
    {
      id: '12',
      nickname: 'Koira',
      picture: 'https://picsum.photos/100/100',
      doneDatesCount: 5,
    },
    {
      id: '11',
      nickname: 'Kissa',
      picture: 'https://picsum.photos/100',
      doneDatesCount: 2,
    },
  ]

  const myDoneDates = ['2023-11-01', '2023-11-02', '2023-11-03']

  const challenge = {
    title: 'Kyykkyhaaste - Lokakuu 2023',
    subtitle: '100 kyykkyä päivässä',
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    participants,
  }

  logger.debug(participants, 'Participants')

  const dates = getChallengeDates({
    startISODate: challenge.startDate,
    endISODate: challenge.endDate,
    todayISODate: formatISO(new Date()).slice(0, 10),
    doneISODates: myDoneDates,
    outputFormat: 'd.M.yyyy (EEEEEE)',
  })

  logger.debug(dates, 'Dates')

  return json({
    user,
    buttons: dates,
    today: 'KOIRA',
    challenge: {
      ...challenge,
      daysCount: dates.length,
    },
  })
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - challenge',
    },
  ]
}

export default function GetChallenge() {
  const { user, challenge, buttons, today } = useLoaderData<typeof loader>()

  const participationActions: Context = {
    onParticipate: (eventId: string) => {},
    onLeave: (eventId: string) => {},
    state: 'idle',
    loadingEventId: undefined,
  }

  const runningTime = `${challenge.startDate} - ${challenge.endDate}}`
  const isParticipating =
    user !== null &&
    challenge.participants.map(({ id }) => id).includes(user.id)

  const buttonList = buttons.map(({ status, text }) => {
    switch (status) {
      case 'DONE': {
        return (
          <Button
            key={text}
            style={{ width: 150 }}
            variant="filled"
            color="green"
            leftSection={<IconCheck size={14} />}
          >
            {text}
          </Button>
        )
      }
      case 'UNDONE': {
        return (
          <Button
            key={text}
            style={{ width: 150 }}
            variant="default"
            color="green"
            leftSection={<IconCircle size={14} />}
          >
            {text}
          </Button>
        )
      }
      case 'FUTURE': {
        return (
          <Button
            key={text}
            style={{ width: 150 }}
            disabled
            variant="default"
            color="green"
            leftSection={<IconCircle size={14} />}
          >
            {text}
          </Button>
        )
      }
    }
  })

  return (
    <Container data-testid="challenges" p="xs" size="1000">
      <Voucher>
        <Voucher.Header bgImageUrl={'/event-images/nordicwalking.jpg'}>
          <Voucher.Header.Title>{challenge.title}</Voucher.Header.Title>
          <Voucher.Header.ParticipantCount
            participants={challenge.participants}
            user={user}
          />
          <Voucher.Header.Creator nick="koira" />
          <Voucher.Header.Competition />
        </Voucher.Header>
        <Voucher.Content>
          <Group justify="space-between">
            <Box>
              <Text fw={700} mt={2}>
                100 kyykkyä päivässä
              </Text>
              <Text size="sm" fw={500}>
                {runningTime}
              </Text>
              <Text size="sm" c="dimmed" fw={400}>
                kk-haaste
              </Text>
            </Box>
            <Group>
              {isParticipating && (
                <Button>Merkitse päivä tehdyksi ({today})</Button>
              )}
              <ParticipatingContext.Provider value={participationActions}>
                <ToggleJoinButton
                  isParticipating={isParticipating}
                  eventId="someUd"
                />
              </ParticipatingContext.Provider>
            </Group>
          </Group>
          <Divider label="Leaderboard" my="sm" labelPosition="center" />
          <Center>
            <Paper shadow="sm" p="xs" withBorder>
              <Stack my="md">
                {challenge.participants.map((cp) => {
                  return (
                    <LeaderboardRow
                      key={cp.id}
                      position={1}
                      participant={cp}
                      daysTotal={challenge.daysCount}
                      daysDone={cp.doneDatesCount}
                    />
                  )
                })}
              </Stack>
            </Paper>
          </Center>
          <Divider label="Omat suoritukset" my="sm" labelPosition="center" />
          <Group m="xs" gap="xs" justify="center">
            {buttonList}
          </Group>
          <Divider />
        </Voucher.Content>
      </Voucher>
    </Container>
  )
}
