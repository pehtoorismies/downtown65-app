import { graphql } from '@downtown65-app/graphql/gql'
import { GetChallengeDocument } from '@downtown65-app/graphql/graphql'
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { IconCheck, IconCircle, IconEye, IconEyeOff } from '@tabler/icons-react'
import { formatISO, parseISO } from 'date-fns'
import React from 'react'
import invariant from 'tiny-invariant'
import { LeaderboardRow } from '~/components/challenge/leaderboard-row'
import { ToggleJoinButton } from '~/components/event-card/toggle-join-button'
import { Voucher } from '~/components/voucher/voucher'
import type { Context } from '~/contexts/participating-context'
import { ParticipatingContext } from '~/contexts/participating-context'
import type { ChallengeParticipant } from '~/domain/user'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'
import { getChallengeDates } from '~/util/challenge-date'
import {
  formatRunningTimeFromMonth,
  getChallengeStatusFromMonth,
} from '~/util/challenge-status'
import { logger } from '~/util/logger.server'

const _GqlIgnored = graphql(`
  query GetChallenge($id: ID!) {
    challenge(id: $id) {
      id
      createdBy {
        id
        nickname
        picture
      }
      dateEnd
      dateStart
      description
      subtitle
      title
    }
  }
`)

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Expected params.id')

  const { user } = await loaderAuthenticate(request)

  const { challenge } = await gqlClient.request(
    GetChallengeDocument,
    {
      id: params.id,
    },
    PUBLIC_AUTH_HEADERS
  )

  if (!challenge) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Haastetta ei löydy',
    })
  }

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

  const start = parseISO(challenge.dateStart)

  const dates = getChallengeDates({
    startISODate: challenge.dateStart,
    endISODate: challenge.dateEnd,
    todayISODate: formatISO(new Date()).slice(0, 10),
    doneISODates: myDoneDates,
    outputFormat: 'd.M.yyyy (EEEEEE)',
  })

  logger.debug(dates, 'Dates')

  const challengeStatus = getChallengeStatusFromMonth(start, new Date())
  const dateRange = formatRunningTimeFromMonth(start)

  return json({
    user,
    doneDates: dates,
    challengeStatus,
    dateRange,
    challenge: {
      ...challenge,
      participants: participants,
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
  const { user, challenge, doneDates, dateRange, challengeStatus } =
    useLoaderData<typeof loader>()
  const [opened, { toggle }] = useDisclosure()

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

  const toggleButton = opened ? (
    <Button mt="md" onClick={toggle} rightSection={<IconEyeOff size={18} />}>
      Piilota omat suoritukset
    </Button>
  ) : (
    <Button m="md" onClick={toggle} rightSection={<IconEye size={18} />}>
      Näytä/editoi omat suoritukset
    </Button>
  )

  const description = challenge.description?.trim()

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
                {challenge.title}
              </Text>
              <Text size="sm" fw={500}>
                {challenge.subtitle}
              </Text>
              <Text size="sm" c="dimmed" fw={400}>
                {dateRange}
              </Text>
              <Text size="sm" fw={500}>
                {challengeStatus.description}
              </Text>
            </Box>
            <Group>
              {isParticipating && challengeStatus.status === 'RUNNING' && (
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
          <Divider my="xs" label="Lisätiedot" labelPosition="center" />
          {!!description && (
            <TypographyStylesProvider p={0} mt="sm">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </TypographyStylesProvider>
          )}
          {!description && (
            <Text ta="center" p="sm" c="dimmed" fw={400}>
              ei tarkempaa tapahtuman kuvausta
            </Text>
          )}
          <Divider my="xs" label="Leaderboard" labelPosition="center" />
          <Center>
            {challengeStatus.status === 'NOT_STARTED' && (
              <Text fs="italic">
                Haaste ei ole alkanut. {challengeStatus.description}
              </Text>
            )}
            {challengeStatus.status !== 'NOT_STARTED' && (
              <Stack my="md">
                {challenge.participants.map((cp) => {
                  return (
                    <LeaderboardRow
                      key={cp.id}
                      position={1}
                      participant={cp}
                      daysTotal={15}
                      daysDone={cp.doneDatesCount}
                    />
                  )
                })}
              </Stack>
            )}
          </Center>
          <Center>{toggleButton}</Center>
          {opened && (
            <>
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
            </>
          )}
        </Voucher.Content>
      </Voucher>
    </Container>
  )
}
