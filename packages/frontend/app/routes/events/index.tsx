import { Container, SimpleGrid, Center, Title, Button } from '@mantine/core'
import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconSquarePlus } from '@tabler/icons'
import { EventCard } from '~/components/event-card/event-card'
import type { EventCardRootProps } from '~/components/event-card/event-card-root'
import { getGqlSdk } from '~/gql/get-gql-client'
import { validateSessionUser } from '~/session.server'
import { mapToData } from '~/util/event-type'

type LoaderData = {
  eventItems: Awaited<EventCardRootProps[]>
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/auth/login')
  }

  const { events } = await getGqlSdk().GetEvents(
    {},
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const mapped = events.map((event) => {
    return {
      ...event,
      type: mapToData(event.type),
      me: result.user,
      participants: [],
    }
  })

  const headers = result.headers ?? {}
  return json({ eventItems: mapped }, { headers })
}

const Events = () => {
  const { eventItems } = useLoaderData<LoaderData>()
  if (eventItems.length === 0) {
    return (
      <Container pt={12} mt="lg">
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
    <Container pt={12}>
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
      >
        {eventItems.map((m) => {
          return (
            <EventCard
              key={m.id}
              {...m}
              onParticipate={() => {}}
              onLeave={() => {}}
            />
          )
        })}
      </SimpleGrid>
    </Container>
  )
}

export default Events
