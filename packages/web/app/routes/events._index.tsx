import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
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
import React from 'react'
import { EventCard } from '~/components/event-card/event-card'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - incoming events',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { accessToken, user } = await loaderAuthenticate(request)

  const { events } = await getGqlSdk().GetEvents(
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )
  const eventItems = events.map((event) => {
    const ddt = new DynamoDatetime({
      date: event.dateStart,
      time: event.timeStart,
    })

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

export default function GetEvents() {
  const { eventItems } = useLoaderData<typeof loader>()
  const participationActions = useParticipationActions()

  if (eventItems.length === 0) {
    return (
      <>
        <EventsBreadcrumb />
        <Container data-testid="events">
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
        </Container>
      </>
    )
  }

  return (
    <>
      <EventsBreadcrumb />
      <Container data-testid="events">
        <ParticipatingContext.Provider value={participationActions}>
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing={{ base: 10, sm: 'md', md: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            {eventItems.map((m) => {
              return <EventCard key={m.id} {...m} shadow="xs" />
            })}
          </SimpleGrid>
        </ParticipatingContext.Provider>
      </Container>
    </>
  )
}
