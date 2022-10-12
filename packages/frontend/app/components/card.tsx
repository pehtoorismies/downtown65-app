import {
  Box,
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Center,
  Avatar,
  Button,
  createStyles,
} from '@mantine/core'
import {
  IconBrandTwitter,
  IconBookmark,
  IconHeart,
  IconShare,
  IconBan,
  IconHandStop,
} from '@tabler/icons'
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
    position: 'relative',
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

  footer: {
    marginTop: theme.spacing.md,
  },
}))

interface EventCardProperties {
  title: string
}

export const EventCard = ({ title }: EventCardProperties) => {
  const { classes, cx, theme } = useStyles()

  return (
    <Card withBorder radius="md" className={cx(classes.card)} shadow="sm">
      <Card.Section>
        <Image
          src="https://www.downtown65.events/static/media/events-spinning.6152d354.jpg"
          height={150}
        />
      </Card.Section>
      <Text className={classes.heading}>Spinning</Text>
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
      <Group position="apart" className={classes.footer}>
        <Box>
          <Text className={classes.title}>{title}</Text>
          <Text size="sm" color="dimmed" weight={400} lineClamp={4}>
            Location
          </Text>
          <Text size="sm" lineClamp={4} weight={500}>
            11.12.2022 (la)
          </Text>
        </Box>
        <ToggleJoinButton isParticipating />
      </Group>

      <Group position="apart" className={classes.footer}>
        <Text size="sm" lineClamp={3} weight={500}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed
          ligula luctus, laoreet massa eget, dictum eros. In hac habitasse
          platea dictumst. Curabitur vehicula sapien eget lectus semper
          vehicula. Sed mattis fringilla euismod. Nullam mollis ultricies nisi,
          eu vehicula tortor laoreet nec. Mauris ultrices erat vitae egestas
          accumsan. Nullam imperdiet libero a ex tincidunt, et tincidunt magna
          auctor. Donec suscipit nunc ac facilisis vulputate.
        </Text>

        <Group spacing={8} mr={0}>
          <Badge>Badge</Badge>
          <Badge variant="gradient">Badge</Badge>
          <Badge>Badge</Badge>
          <Badge>Badge</Badge>
          <Badge>Badge</Badge>
          <Badge>....</Badge>
        </Group>
      </Group>
    </Card>
  )
}
