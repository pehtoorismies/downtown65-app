import type { MantineNumberSize } from '@mantine/core'
import {
  Avatar,
  BackgroundImage,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Text,
  createStyles,
} from '@mantine/core'
import { useNavigate } from '@remix-run/react'
import { IconArrowNarrowRight } from '@tabler/icons'
import { ToggleJoinButton } from '~/components/toggle-join-button'

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: theme.colors.white,
  },

  count: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: 'none',
  },

  heading: {
    textShadow: 'black 2px 2px 10px',
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
    textShadow: 'black 1px 1px 8px',
  },

  pillHighlight: {
    backgroundColor: theme.colors.dtPink,
    borderRadius: 2,
  },
  pill: {
    backgroundColor: theme.colors.blue,
    borderRadius: 2,
  },
}))

type Participant = {
  id: string
  nick: string
}

interface ParticipantProperties {
  participants: Participant[]
  me: Participant
}

export interface EventCardProperties extends ParticipantProperties {
  isExtended: boolean
  id: string
  title: string
  type: {
    text: string
    imageUrl: string
  }
  description: string
}

const Participants = ({ participants, me }: ParticipantProperties) => {
  const { classes, cx } = useStyles()

  return (
    <Group spacing={8} mr={0} mt="md">
      {participants.map((p) => {
        const isHighlighted = p.id === me.id
        const size: MantineNumberSize = 11

        const attributes = {
          color: 'white',
          px: 6,
          py: 1,
          size,
        }

        return isHighlighted ? (
          <Text key={p.id} {...attributes} className={classes.pillHighlight}>
            {p.nick}
          </Text>
        ) : (
          <Text key={p.id} {...attributes} className={classes.pill}>
            {p.nick}
          </Text>
        )
      })}
    </Group>
  )
}

export const EventCard = ({
  id,
  title,
  type,
  participants,
  me,
  description,
  isExtended,
}: EventCardProperties) => {
  const navigate = useNavigate()
  const { classes, cx } = useStyles()

  const isParticipating = participants.map(({ id }) => id).includes(me.id)

  return (
    <Card withBorder radius="md" className={cx(classes.card)} shadow="sm">
      <Card.Section>
        <Box>
          <BackgroundImage src={type.imageUrl}>
            <Center p="md">
              <Text
                color="#fff"
                size={30}
                px="xs"
                my={36}
                className={classes.heading}
              >
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
        className={classes.count}
        color={isParticipating ? 'dtPink.9' : 'blue.9'}
        variant="filled"
      >
        {participants.length}
      </Badge>
      <Group position="apart">
        <Box>
          <Text className={classes.title}>{title}</Text>
          <Text size="sm" color="dimmed" weight={400}>
            Location
          </Text>
          <Text size="sm" lineClamp={4} weight={500}>
            11.12.2022 (la)
          </Text>
        </Box>
        <ToggleJoinButton isParticipating={isParticipating} />
      </Group>

      <Text size="sm" lineClamp={isExtended ? 0 : 3} weight={500} mt="xs">
        {description}
      </Text>
      <Group position="apart">
        {isExtended ? (
          <Participants participants={participants} me={me} />
        ) : (
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
              onClick={() => navigate(`/events/${id}`)}
            >
              Näytä
            </Button>
          </Center>
        )}
      </Group>
    </Card>
  )
}
