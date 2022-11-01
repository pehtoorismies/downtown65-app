import type { MantineShadow } from '@mantine/core'
import {
  Card,
  Group,
  Text,
  createStyles,
  Stack,
  BackgroundImage,
  Center,
  Badge,
  Avatar,
  ThemeIcon,
  Box,
} from '@mantine/core'
import { IconMedal, IconUsers } from '@tabler/icons'
import type { PropsWithChildren } from 'react'
import { Gradient } from '~/components/colors'
import {
  DisabledInButton,
  ToggleJoinButton,
} from '~/components/event-card/toggle-join-button'
import type { User } from '~/domain/user'
import type { EventType } from '~/gql/types.gen'
import { mapToData } from '~/util/event-type'

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: theme.colors.white,
  },

  title: {
    display: 'block',
    marginTop: theme.spacing.sm,
    fontWeight: 700,
  },

  typeTitle: {
    textShadow: 'black 2px 2px 10px',
    fontWeight: 700,
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },

  count: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: 'none',
  },

  creator: {
    position: 'absolute',
    right: 3,
    top: theme.spacing.xs + 120,
    visibility: 'hidden',
  },

  race: {
    position: 'absolute',
    left: theme.spacing.xs,
    top: theme.spacing.xs,
    boxShadow: '3px 3px 16px #888888',
  },
}))

interface ParticipantProps {
  participants: User[]
  me?: User
}

export type OnParticipateEvent = (me: User, eventId?: string) => void

export interface EventCardRootProps extends ParticipantProps {
  isRace: boolean
  id?: string
  title: string
  type: EventType
  location: string
  createdBy: User
  shadow?: MantineShadow
  onParticipate: OnParticipateEvent
  onLeave: OnParticipateEvent
}

export const EventCardRoot = ({
  id,
  children,
  createdBy,
  isRace,
  location,
  me,
  participants,
  title,
  type,
  shadow,
  onParticipate,
  onLeave,
}: PropsWithChildren<EventCardRootProps>) => {
  const { classes, cx } = useStyles()
  const meAttending =
    me !== undefined && participants.map(({ id }) => id).includes(me.id)
  const gradient = meAttending ? Gradient.dtPink : Gradient.blue
  const { text, imageUrl } = mapToData(type)

  return (
    <Card withBorder radius="md" className={cx(classes.card)} shadow={shadow}>
      <Card.Section>
        <Box>
          <BackgroundImage src={imageUrl}>
            <Center p="md">
              <Text
                color="#fff"
                size={30}
                px="xs"
                my={36}
                className={classes.typeTitle}
              >
                {text}
              </Text>
            </Center>
            <Badge
              size="lg"
              leftSection={
                <Center>
                  <IconUsers size={18} />
                </Center>
              }
              radius="sm"
              className={classes.count}
              variant="gradient"
              gradient={gradient}
            >
              {participants.length}
            </Badge>
            <Badge
              className={classes.creator}
              styles={{ inner: { textTransform: 'none' } }}
              sx={(theme) => ({
                paddingLeft: 0,
                paddingRight: theme.spacing.xs,
                opacity: 0.8,
              })}
              size="sm"
              radius="sm"
              variant="gradient"
              leftSection={
                <Avatar
                  alt="Creator image"
                  size={18}
                  src={createdBy.picture}
                  radius="sm"
                />
              }
            >
              created by: {createdBy.nickname}
            </Badge>

            {isRace && (
              <ThemeIcon
                className={classes.race}
                size="lg"
                gradient={gradient}
                variant="gradient"
              >
                <IconMedal />
              </ThemeIcon>
            )}
          </BackgroundImage>
        </Box>
      </Card.Section>
      <Card.Section withBorder px="xs" pb="xs">
        <Group position="apart">
          <Stack spacing={0} align="flex-start">
            <Text className={classes.title}>{title}</Text>
            <Text size="sm" color="dimmed" weight={400}>
              {location}
            </Text>
            <Text size="sm" weight={500}>
              11.12.2022 (la)
            </Text>
          </Stack>
          {!me && <DisabledInButton />}
          {me && (
            <ToggleJoinButton
              isParticipating={meAttending}
              onParticipate={() => {
                onParticipate(me, id)
              }}
              onLeave={() => {
                onLeave(me, id)
              }}
            />
          )}
        </Group>
      </Card.Section>
      {children}
    </Card>
  )
}
