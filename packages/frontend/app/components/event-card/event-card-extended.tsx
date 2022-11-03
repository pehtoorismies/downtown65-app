import {
  Card,
  Badge,
  TypographyStylesProvider,
  Group,
  Text,
} from '@mantine/core'
import { Gradient } from '~/components/colors'
import type { EventCardRootProps } from '~/components/event-card/event-card-root'
import { EventCardRoot } from '~/components/event-card/event-card-root'

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
        <Group position="center" spacing={2}>
          {props.participants.map((p) => {
            const gradient =
              props.me?.id === p.id
                ? Gradient.dtPink
                : { from: 'indigo', to: 'blue', deg: 45 }

            return (
              <Badge
                m={2}
                radius="sm"
                key={p.id}
                styles={{ inner: { textTransform: 'none' } }}
                variant="gradient"
                gradient={gradient}
              >
                {p.nickname}
              </Badge>
            )
          })}
        </Group>
      </Card.Section>
    </EventCardRoot>
  )
}
