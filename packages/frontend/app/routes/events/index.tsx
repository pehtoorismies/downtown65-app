import { DynamoDatetime } from '@downtown65-app/common'
import { Button, Center, Container, SimpleGrid, Title } from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconSquarePlus } from '@tabler/icons'
import type { EventLoaderData } from './modules/event-loader-data'
import { EventCard } from '~/components/event-card/event-card'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - incoming events',
  }
}

interface LoaderData extends PrivateRoute {
  eventItems: EventLoaderData[]
}

export const loader: LoaderFunction = async ({ request }) => {
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

  return json<LoaderData>({
    eventItems,
    user,
  })
}

export default function GetEvents() {
  const { eventItems } = useLoaderData<LoaderData>()
  const participationActions = useParticipationActions()

  if (eventItems.length === 0) {
    return (
      <Container pt={12} mt="lg" data-testid="events">
        <Title order={1} align="center">
          Ei tulevia tapahtumia
        </Title>
        <Center>
          <Button
            component={Link}
            to="/events/new"
            size="lg"
            mt="xs"
            rightIcon={<IconSquarePlus size={30} />}
            styles={() => ({
              leftIcon: {
                marginRight: 15,
              },
            })}
          >
            Luo uusi tapahtuma
          </Button>
        </Center>
      </Container>
    )
  }

  return (
    <Container py={12} data-testid="events">
      <ParticipatingContext.Provider value={participationActions}>
        <SimpleGrid
          cols={2}
          breakpoints={[
            { maxWidth: 980, cols: 2, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {eventItems.map((m) => {
            return <EventCard key={m.id} {...m} shadow="xs" />
          })}
        </SimpleGrid>
      </ParticipatingContext.Provider>
    </Container>
  )
}
