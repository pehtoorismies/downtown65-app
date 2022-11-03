import type { MantineShadow } from '@mantine/core'
import {
  Card,
  Text,
  createStyles,
  BackgroundImage,
  Center,
  Badge,
  Avatar,
  ThemeIcon,
  Box,
  Grid,
} from '@mantine/core'
import { IconMedal, IconUsers } from '@tabler/icons'
import format from 'date-fns/format'
import { fi } from 'date-fns/locale'
import type { PropsWithChildren } from 'react'
import { Gradient } from '~/components/colors'
import {
  DisabledInButton,
  ToggleJoinButton,
} from '~/components/event-card/toggle-join-button'
import type { User } from '~/domain/user'
import type { EventType } from '~/gql/types.gen'
import { mapToData } from '~/util/event-type'

const onlyDateRegexp = /^\d{4}-\d{2}-\d{2}$/

const formatTime = (date: string): string | undefined => {
  if (onlyDateRegexp.test(date)) {
    return
  }
  return format(new Date(date), `'klo.' HH:mm`, {
    locale: fi,
  })
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd.MM.yyyy (EEEEEE)', {
    locale: fi,
  })
}

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: theme.colors.white,
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

export interface EventCardRootProps extends ParticipantProps {
  isRace: boolean
  id?: string
  dateStart: string
  title: string
  type: EventType
  location: string
  createdBy: User
  shadow?: MantineShadow
}

export const EventCardRoot = ({
  children,
  createdBy,
  dateStart,
  id,
  isRace,
  location,
  me,
  participants,
  shadow,
  title,
  type,
}: PropsWithChildren<EventCardRootProps>) => {
  const { classes, cx } = useStyles()
  const meAttending =
    me !== undefined && participants.map(({ id }) => id).includes(me.id)
  const gradient = meAttending ? Gradient.dtPink : Gradient.blue
  const { text, imageUrl } = mapToData(type)
  const formattedDate = formatDate(dateStart)
  const formattedTime = formatTime(dateStart)

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
        <Text weight={700} mt={2}>
          {title}
        </Text>
        <Grid align="center">
          <Grid.Col span={7}>
            <Text size="sm" color="dimmed" weight={400}>
              {location}
            </Text>
            <Text size="sm" weight={500}>
              {formattedDate}
            </Text>
            {formattedTime && (
              <Text size="sm" weight={500}>
                {formattedTime}
              </Text>
            )}
            {!formattedTime && (
              <Text size="sm" weight={500} color="dimmed">
                ei tarkempaa aikaa
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span={5}>
            <Center>
              {!me && <DisabledInButton />}
              {me && (
                <ToggleJoinButton isParticipating={meAttending} eventId={id} />
              )}
            </Center>
          </Grid.Col>
        </Grid>
      </Card.Section>
      {children}
    </Card>
  )
}
