import { graphql } from '@downtown65-app/graphql/gql'
import {
  GetChallengeDocument,
  LeaveChallengeDocument,
  ParticipateChallengeDocument,
} from '@downtown65-app/graphql/graphql'
import { Anchor, Breadcrumbs, Container, Text } from '@mantine/core'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { formatISO, parseISO } from 'date-fns'
import React from 'react'
import invariant from 'tiny-invariant'
import { ChallengeCard } from '~/components/challenge/challenge-card'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import { actionAuthenticate, loaderAuthenticate } from '~/session.server'
import { getChallengeDates } from '~/util/challenge-date'
import type { ChallengeStatus } from '~/util/challenge-tools'
import { getChallengeStatusFromMonth } from '~/util/challenge-tools'

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
      participants {
        id
        picture
        nickname
        joinedAt
      }
    }
  }
  mutation ParticipateChallenge($id: ID!, $me: MeInput!) {
    participateChallenge(id: $id, me: $me)
  }
  mutation LeaveChallenge($id: ID!) {
    leaveChallenge(id: $id)
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - challenge',
    },
  ]
}

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

  const myDoneDates = ['2023-11-01', '2023-11-02', '2023-11-03']

  const start = parseISO(challenge.dateStart)

  const dates = getChallengeDates({
    startISODate: challenge.dateStart,
    endISODate: challenge.dateEnd,
    todayISODate: formatISO(new Date()).slice(0, 10),
    doneISODates: myDoneDates,
    outputFormat: 'd.M.yyyy (EEEEEE)',
  })

  const challengeStatus: ChallengeStatus = getChallengeStatusFromMonth(
    start,
    new Date()
  )

  return json({
    user,
    doneDates: dates,
    challengeStatus,
    challenge,
  })
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.id, 'Expected params.id')
  const { headers, user, accessToken } = await actionAuthenticate(request)
  const body = await request.formData()
  const action = body.get('action')

  switch (action) {
    case 'participate': {
      await gqlClient.request(
        ParticipateChallengeDocument,
        {
          id: params.id,
          me: user,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      )
      return json({}, { headers })
    }
    case 'leave': {
      await gqlClient.request(
        LeaveChallengeDocument,
        {
          id: params.id,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      )
      return json({}, { headers })
    }
    default: {
      throw new Error(
        `Incorrect action provided: '${action}'. Use 'leave' or 'participate'`
      )
    }
  }
}

export default function GetChallenge() {
  const { user, challenge, doneDates, challengeStatus } =
    useLoaderData<typeof loader>()

  const participationActions = useParticipationActions('challenge')

  const items = [
    { title: 'Haasteet', href: '/challenges' },
    { title: challenge.title },
  ].map((item, index) => {
    return item.href ? (
      <Anchor component={Link} to={item.href} key={index}>
        {item.title}
      </Anchor>
    ) : (
      <Text key={index}>{item.title}</Text>
    )
  })

  // const [opened, { toggle }] = useDisclosure()
  //
  // const participationActions = useParticipationActions('challenge')
  //
  // const isParticipating =
  //   user !== null &&
  //   challenge.participants.map(({ id }) => id).includes(user.id)
  //
  // const props = {
  //   ...challenge,
  //   user,
  //   dateRange,
  //   status: challengeStatus,
  // }

  return (
    <>
      <Container fluid pt={12}>
        <Breadcrumbs mb="xs">{items}</Breadcrumbs>
      </Container>
      <Container>
        <ParticipatingContext.Provider value={participationActions}>
          <ChallengeCard
            user={user}
            challenge={challenge}
            challengeStatus={challengeStatus}
            myDoneDates={doneDates}
          />
        </ParticipatingContext.Provider>
      </Container>
    </>
  )
}
