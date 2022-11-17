import { Button, Center, Container, SimpleGrid, Title } from '@mantine/core'
import { Link, useLoaderData } from '@remix-run/react'
import { IconSquarePlus } from '@tabler/icons'
import type { LoaderData } from './loader'
import { EventCard } from '~/components/event-card/event-card'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'

export const Events = () => {
  const { eventItems } = useLoaderData<LoaderData>()
  const participationActions = useParticipationActions()

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
    <Container py={12}>
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
