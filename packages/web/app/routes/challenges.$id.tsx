import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { IconCheck, IconCircle } from '@tabler/icons-react'
import { differenceInCalendarDays, format, formatISO, parseISO } from 'date-fns'
import React from 'react'
import { LeaderboardRow } from '~/components/challenge/leaderboard-row'
import { ToggleJoinButton } from '~/components/event-card/toggle-join-button'
import { Voucher } from '~/components/voucher/voucher'
import type { Context } from '~/contexts/participating-context'
import { ParticipatingContext } from '~/contexts/participating-context'
import type { ChallengeParticipant } from '~/domain/user'
import { loaderAuthenticate } from '~/session.server'
import { addChallengePosition } from '~/util/add-challenge-position'
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
      id: '10',
      nickname: 'Koira',
      picture: 'https://picsum.photos/100/100',
      doneDatesCount: 5,
    },
    {
      id: '20',
      nickname: 'Kissa',
      picture: 'https://picsum.photos/100?123',
      doneDatesCount: 2,
    },
    {
      id: '30',
      nickname: 'Hevoinen',
      picture: 'https://picsum.photos/100?12',
      doneDatesCount: 2,
    },
    {
      id: '40',
      nickname: 'Hevoinen',
      picture: 'https://picsum.photos/100?12',
      doneDatesCount: 8,
    },
  ]

  const myDoneDates = ['2023-11-01', '2023-11-02', '2023-11-03']

  const challenge = {
    title: 'Kyykkyhaaste - Marraskuu 2023',
    subtitle: '100 kyykkyä päivässä',
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    kind: 'daily',
    participants: addChallengePosition(participants),
    description: '<h2>Kk haaste</h2><h3>kissa</h3>',
  }

  const endDate = parseISO(challenge.endDate)
  const today = new Date()
  const start = parseISO(challenge.startDate)
  const end = parseISO(challenge.endDate)

  const runningTime = `${format(start, 'd.M.yyyy')} - ${format(
    end,
    'd.M.yyyy'
  )}`

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
    doneDates: dates,
    today: 'KOIRA',
    runningTime,
    daysLeft: differenceInCalendarDays(endDate, today),
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
  const { user, challenge, doneDates, runningTime, daysLeft } =
    useLoaderData<typeof loader>()

  const dayFi = daysLeft === 1 ? 'päivä' : 'päivää'

  const dayInfo = `${daysLeft} ${dayFi} jäljellä`

  const participationActions: Context = {
    onParticipate: () => {},
    onLeave: () => {},
    state: 'idle',
    loadingEventId: undefined,
  }

  const isParticipating =
    user !== null &&
    challenge.participants.map(({ id }) => id).includes(user.id)

  const hasDoneChallenges = doneDates.length > 0

  const buttonList = doneDates.map(({ status, text }) => {
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
            variant="outline"
            color="red"
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
                Omaan tahtiin
              </Text>
              <Text size="sm" c="dimmed" fw={400}>
                {runningTime}
              </Text>
              <Text size="sm" fw={500}>
                {dayInfo}
              </Text>
            </Box>
            <Group>
              {isParticipating && (
                <Button leftSection={<IconCircle size={14} />}>
                  Merkitse tämä päivä tehdyksi
                </Button>
              )}
              {!hasDoneChallenges && (
                <ParticipatingContext.Provider value={participationActions}>
                  <ToggleJoinButton
                    isParticipating={isParticipating}
                    eventId="someUd"
                  />
                </ParticipatingContext.Provider>
              )}
            </Group>
          </Group>
          <Paper bg="#FAFAF8" my="sm">
            <TypographyStylesProvider p="xs" m={0}>
              <div
                dangerouslySetInnerHTML={{ __html: challenge.description }}
              />
            </TypographyStylesProvider>
          </Paper>
          <Center>
            <Title order={2} my="md">
              Leaderboard
            </Title>
          </Center>
          <Center>
            <Paper shadow="sm" p="xs" withBorder style={{ width: '100%' }}>
              <Stack my="md">
                {challenge.participants.map((cp) => {
                  return (
                    <LeaderboardRow
                      key={cp.id}
                      position={cp.position}
                      participant={cp}
                      daysTotal={challenge.daysCount}
                      daysDone={cp.doneDatesCount}
                    />
                  )
                })}
              </Stack>
            </Paper>
          </Center>
          <Center>
            <Title my="md" order={2}>
              Omat suoritukset
            </Title>
          </Center>
          <Center>
            <Text>Muokkaa menneitä suorituksia klikkaamalla päivää.</Text>
          </Center>
          <Group m="sm" gap="xs" justify="center">
            {buttonList}
          </Group>
        </Voucher.Content>
      </Voucher>
    </Container>
  )
}
