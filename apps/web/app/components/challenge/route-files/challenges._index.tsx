import { toISODate } from '@downtown65-app/time'
import {
  Breadcrumbs,
  Button,
  Center,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconArrowNarrowRight, IconTargetArrow } from '@tabler/icons-react'
import { parseISO } from 'date-fns'
import type { ReactNode } from 'react'
import React from 'react'
import { ListChallengeCard } from '~/components/challenge/list-challenge-card'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import { graphql } from '~/generated/gql'
import { GetChallengesDocument } from '~/generated/graphql'
import { gqlClient } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'
import type { ChallengeStatus } from '~/util/challenge-tools'
import { getChallengeStatusFromMonth } from '~/util/challenge-tools'

const _GqlIgnored = graphql(`
  query GetChallenges($filter: ChallengeFilter) {
    challenges(filter: $filter) {
      id
      createdBy {
        id
        nickname
        picture
      }
      dateStart
      dateEnd
      description
      participants {
        id
        joinedAt
        nickname
        picture
      }

      subtitle
      title
    }
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - incoming challenges',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, accessToken } = await loaderAuthenticate(request)

  const now = toISODate(new Date())
  if (!now.success) {
    throw new Error('Unexpected error formatting toISODate(new Date())')
  }

  const { challenges } = await gqlClient.request(
    GetChallengesDocument,
    {
      filter: {
        dateEnd: {
          // 2022-21-12
          after: now.data,
        },
      },
    },
    {
      Authorization: `Bearer ${accessToken}`,
    },
  )

  return json({
    user,
    challenges: challenges.map((c) => {
      const challengeStatus: ChallengeStatus = getChallengeStatusFromMonth(
        parseISO(c.dateStart),
        new Date(),
      )
      return {
        ...c,
        challengeStatus,
      }
    }),
  })
}

const ChallengesBreadcrumb = () => {
  return (
    <Container fluid>
      <Breadcrumbs mb="xs">
        <Text data-testid="breadcrumbs-current">Haasteet</Text>
      </Breadcrumbs>
    </Container>
  )
}

const Root = ({ children }: { children: ReactNode }) => (
  <>
    <ChallengesBreadcrumb />
    <Container data-testid="events" p="xs" size="1000">
      {children}
    </Container>
  </>
)

export default function GetEvents() {
  const { challenges, user } = useLoaderData<typeof loader>()
  const participationActions = useParticipationActions('challenge')

  if (challenges.length === 0) {
    return (
      <Root>
        <Title order={1} ta="center">
          Ei tulevia haasteita
        </Title>
        <Center>
          <Button
            component={Link}
            to="/challenges/new"
            color="yellow"
            size="lg"
            mt="xs"
            rightSection={<IconTargetArrow size={30} />}
          >
            Luo uusi haaste
          </Button>
        </Center>
      </Root>
    )
  }

  return (
    <Root>
      <ParticipatingContext.Provider value={participationActions}>
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 'sm', md: 'xl' }}
          verticalSpacing={{ base: 'sm', md: 'xl' }}
        >
          {challenges.map((c) => {
            return (
              <ListChallengeCard
                key={c.id}
                user={user}
                challenge={c}
                challengeStatus={c.challengeStatus}
              />
            )
          })}
        </SimpleGrid>
      </ParticipatingContext.Provider>
      <Group justify="flex-end">
        <Button
          component={Link}
          to={'/old-challenges/'}
          my="xs"
          color="yellow"
          rightSection={<IconArrowNarrowRight size={18} />}
        >
          Näytä vanhat haasteet
        </Button>
      </Group>
    </Root>
  )
}
