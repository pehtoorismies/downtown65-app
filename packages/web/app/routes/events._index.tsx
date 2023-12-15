import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import { graphql } from '@downtown65-app/graphql/gql'
import { GetEventsDocument } from '@downtown65-app/graphql/graphql'
import {
  Breadcrumbs,
  Button,
  Center,
  Container,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconSquarePlus } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import React from 'react'
import { ListEventCard } from '~/components/event/list-event-card'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import { gqlClient } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'

const _GqlIgnored = graphql(`
  query GetEvents {
    events {
      id
      createdBy {
        id
        nickname
        picture
      }
      dateStart
      description
      location
      participants {
        id
        joinedAt
        nickname
        picture
      }
      race
      subtitle
      title
      timeStart
      type
    }
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - incoming events',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { accessToken, user } = await loaderAuthenticate(request)

  const { events } = await gqlClient.request(
    GetEventsDocument,
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )
  const eventItems = events.map((event) => {
    const ddt = DynamoDatetime.fromISO(
      event.dateStart,
      event.timeStart ?? undefined
    )

    return {
      ...event,
      dateStart: ddt.getFormattedDate(),
      description: event.description ?? '',
      isRace: event.race,
      me: user,
    }
  })

  return json({
    eventItems,
    user,
  })
}

const EventsBreadcrumb = () => {
  return (
    <Container fluid>
      <Breadcrumbs mb="xs">
        <Text data-testid="breadcrumbs-current">Tapahtumat</Text>
      </Breadcrumbs>
    </Container>
  )
}

const Root = ({ children }: { children: ReactNode }) => (
  <>
    <EventsBreadcrumb />
    <Container data-testid="events" p="xs" size="1000">
      {children}
    </Container>
  </>
)

export default function GetEvents() {
  const { eventItems } = useLoaderData<typeof loader>()
  const participationActions = useParticipationActions('event')

  if (eventItems.length === 0) {
    return (
      <Root>
        <Title order={1} ta="center">
          Ei tulevia tapahtumia
        </Title>
        <Center>
          <Button
            component={Link}
            to="/events/new"
            size="lg"
            mt="xs"
            rightSection={<IconSquarePlus size={30} />}
          >
            Luo uusi tapahtuma
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
          {eventItems.map((x) => {
            return <ListEventCard key={x.id} {...x} eventId={x.id} />
          })}
        </SimpleGrid>
      </ParticipatingContext.Provider>
    </Root>
  )
}
