import { Button, Center } from '@mantine/core'
import { useNavigate } from '@remix-run/react'
import { IconArrowNarrowRight } from '@tabler/icons'
import type { EventCardRootProps } from '~/components/event-card/event-card-root'
import { EventCardRoot } from '~/components/event-card/event-card-root'

export const EventCard = (props: EventCardRootProps) => {
  const navigate = useNavigate()

  return (
    <EventCardRoot {...props}>
      <Center style={{ width: '100%' }}>
        <Button
          fullWidth
          mt="xs"
          compact
          variant="outline"
          rightIcon={<IconArrowNarrowRight size={18} />}
          styles={() => ({
            leftIcon: {
              marginRight: 15,
            },
          })}
          onClick={() => navigate(`/events/${props}`)}
        >
          Näytä
        </Button>
      </Center>
    </EventCardRoot>
  )
}
