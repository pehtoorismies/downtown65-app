import { Button } from '@mantine/core'
import { Link } from '@remix-run/react'
import { IconArrowNarrowRight } from '@tabler/icons-react'
import type { EventCardRootProps } from '~/components/event-card/event-card-root'
import { EventCardRoot } from '~/components/event-card/event-card-root'

export const EventCard = (props: EventCardRootProps) => {
  return (
    <EventCardRoot {...props}>
      <Button
        component={Link}
        to={`/events/${props.id}`}
        fullWidth
        mt="xs"
        size="compact-sm"
        rightSection={<IconArrowNarrowRight size={18} />}
        variant="subtle"
      >
        Näytä lisää
      </Button>
    </EventCardRoot>
  )
}
