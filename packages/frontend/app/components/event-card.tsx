import {
  Box,
  Card,
  Text,
  Badge,
  Group,
  Center,
  Avatar,
  BackgroundImage,
  createStyles,
} from '@mantine/core'
import { ToggleJoinButton } from '~/components/toggle-join-button'

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  rating: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: 'none',
  },

  heading: {
    textShadow: 'black 2px 2px 5px',
    fontWeight: 700,
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },

  title: {
    display: 'block',
    marginTop: theme.spacing.sm,
    fontWeight: 700,
  },

  creator: {
    position: 'absolute',
    right: theme.spacing.xs,
    top: theme.spacing.xs + 110,
    pointerEvents: 'none',
  },

  action: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    }),
  },
}))

type Participant = {
  id: string
  nick: string
}

export interface EventCardProperties {
  id: string
  title: string
  type: {
    text: string
    imageUrl: string
  }
  me: Participant
  participants: Participant[]
  description: string
}

export const EventCard = ({
  title,
  type,
  participants,
  me,
  description,
}: EventCardProperties) => {
  const { classes, cx, theme } = useStyles()

  const isParticipating = participants.map(({ id }) => id).includes(me.id)

  return (
    <Card withBorder radius="md" className={cx(classes.card)} shadow="sm">
      <Card.Section>
        <Box>
          <BackgroundImage src={type.imageUrl}>
            <Center p="md">
              <Text color="#fff" size={30} py={36} className={classes.heading}>
                {type.text}
              </Text>
            </Center>
          </BackgroundImage>
        </Box>
      </Card.Section>
      <Center className={classes.creator}>
        <Text size="xs" inline color="white" mr="sm">
          by pehtoorismies
        </Text>
        <Avatar
          src="https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png"
          size={24}
          radius="xl"
          mr="xs"
        />
      </Center>
      <Badge
        size="xl"
        className={classes.rating}
        variant="gradient"
        gradient={{ from: '#FF80EA', to: '#FF80FF', deg: 105 }}
      >
        32
      </Badge>
      <Group position="apart">
        <Box>
          <Text className={classes.title}>{title}</Text>
          <Text size="sm" color="dimmed" weight={400} lineClamp={4}>
            Location
          </Text>
          <Text size="sm" lineClamp={4} weight={500}>
            11.12.2022 (la)
          </Text>
        </Box>
        <ToggleJoinButton isParticipating={isParticipating} />
      </Group>

      <Group position="apart">
        <Text size="sm" lineClamp={3} weight={500} mt="xs">
          {description}
        </Text>

        <Group spacing={8} mr={0}>
          {participants.map((p) => {
            return (
              <Text
                key={p.id}
                size="xs"
                color={isParticipating ? 'red' : 'blue'}
              >
                {p.nick}
              </Text>
            )
          })}
        </Group>
      </Group>
    </Card>
  )
}
