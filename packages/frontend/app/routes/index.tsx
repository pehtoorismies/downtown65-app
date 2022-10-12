import { Container, SimpleGrid } from '@mantine/core'
import { EventCard } from '~/components/card'

const index = () => {
  return (
    <Container pt={12}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 980, cols: 3, spacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
      >
        <EventCard title="Koira" />
        <EventCard title="Koira" />
        <EventCard title="Koira" />
        <EventCard title="Koira" />
        <EventCard title="Koira" />
        <EventCard title="Koira" />
      </SimpleGrid>
    </Container>
  )
}

export default index
