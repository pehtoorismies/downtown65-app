import { Button, Center } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconArrowNarrowRight } from '@tabler/icons'
import type { EventCardRootProps } from '~/components/event-card/event-card-root'
import { EventCardRoot } from '~/components/event-card/event-card-root'

export const EventCard = (props: EventCardRootProps) => {
  return (
    <EventCardRoot {...props}>
      <Center style={{ width: '100%' }}>
        <Button
          component={Link}
          to={`/events/${props.id}`}
          fullWidth
          mt="xs"
          compact
          variant="outline"
          rightIcon={<IconArrowNarrowRight size={18} />}
        >
          Näytä
        </Button>
      </Center>
    </EventCardRoot>
  )
}
