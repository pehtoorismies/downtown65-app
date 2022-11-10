import { Card, TypographyStylesProvider, Text } from '@mantine/core'
import type { EventCardRootProps } from '~/components/event-card/event-card-root'
import { EventCardRoot } from '~/components/event-card/event-card-root'
import { Participants } from '~/components/event-card/participants'

interface EventCardExtendedProps extends EventCardRootProps {
  description: string
}

export const EventCardExtended = (props: EventCardExtendedProps) => {
  const hasDescription = !!props.description.trim()

  return (
    <EventCardRoot {...props}>
      {hasDescription ? (
        <TypographyStylesProvider p={0} mt="sm">
          <div dangerouslySetInnerHTML={{ __html: props.description }} />
        </TypographyStylesProvider>
      ) : (
        <Text align="center" p="sm" color="dimmed" weight={400}>
          ei tarkempaa tapahtuman kuvausta
        </Text>
      )}
      <Card.Section p="xs" withBorder>
        <Text size="sm" weight={400}>
          Osallistujat:
        </Text>
        <Participants participants={props.participants} me={props.me} />
      </Card.Section>
    </EventCardRoot>
  )
}
