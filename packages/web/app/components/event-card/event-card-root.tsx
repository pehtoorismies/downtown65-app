import type { MantineShadow } from '@mantine/core'
import {
  BackgroundImage,
  Badge,
  Box,
  Card,
  Center,
  Grid,
  Group,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconMedal, IconUsers } from '@tabler/icons-react'
import type { PropsWithChildren } from 'react'
import classes from './event-card-root.module.css'
import { Gradient } from '~/components/colors'
import {
  GotoLoginButton,
  ToggleJoinButton,
} from '~/components/event-card/toggle-join-button'
import type { User } from '~/domain/user'
import type { EventType } from '~/gql/types.gen'
import { mapToData } from '~/util/event-type'

interface ParticipantProps {
  participants: User[]
  me?: User
}

export interface EventCardRootProps extends ParticipantProps {
  createdBy: User
  dateStart: string
  id?: string
  isRace: boolean
  location: string
  shadow?: MantineShadow
  subtitle: string
  timeStart?: string
  title: string
  type: EventType
}

const BADGE_MARGIN = 0

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
  subtitle,
  timeStart,
  title,
  type,
}: PropsWithChildren<EventCardRootProps>) => {
  // const { classes, cx } = useStyles()
  const meAttending =
    me !== undefined && participants.map(({ id }) => id).includes(me.id)

  const { imageUrl } = mapToData(type)
  const count = participants.length

  const time = timeStart ? `klo ${timeStart}` : ''

  // TODO: was className={cx(classes.card)}
  // btw use import cx from 'clsx';
  return (
    <Card withBorder radius="md" className={classes.card} shadow={shadow}>
      <Card.Section>
        <BackgroundImage src={imageUrl}>
          <Box className={classes.grid}>
            <Box className={classes.gridTitle}>
              <Text
                ta="center"
                c="#fff"
                // TODO: was size={23}
                size="23"
                className={classes.gridTitleText}
                data-testid="event-title"
              >
                {title}
              </Text>
            </Box>
            <Badge
              m={BADGE_MARGIN}
              py="xs"
              px={4}
              className={classes.gridCreator}
              // TODO: was styles={{ inner: { textTransform: 'none' } }}
              // styles API
              // styles={{ inner: { textTransform: 'none' } }}
              size="md"
              radius="xs"
              variant="outline"
              color="blue.0"
              data-testid="event-created-by"
            >
              by #{createdBy.nickname}
            </Badge>
            <Badge
              data-testid="event-participant-count"
              m={BADGE_MARGIN}
              size="lg"
              leftSection={
                <Center>
                  <IconUsers size={18} />
                </Center>
              }
              radius="sm"
              variant={meAttending ? 'gradient' : 'filled'}
              gradient={Gradient.dtPink}
              className={classes.gridCount}
            >
              {count}
            </Badge>
            {isRace && (
              <ThemeIcon
                data-testid="event-race"
                m={BADGE_MARGIN}
                py="xs"
                px={4}
                className={classes.gridRace}
                // TODO: was styles={{ inner: { textTransform: 'none' } }}
                // styles API
                // styles={{ inner: { textTransform: 'none' } }}
                size="md"
                radius="xs"
                variant="outline"
                color="blue.0"
              >
                <IconMedal color="white" />
              </ThemeIcon>
            )}
          </Box>
        </BackgroundImage>
      </Card.Section>
      <Grid align="center" my={2} gutter="xs">
        <Grid.Col span={7}>
          <Text fw={700} mt={2} data-testid="event-subtitle">
            {subtitle}
          </Text>
          <Text size="sm" fw={500} data-testid="event-date">
            {dateStart} {time}
          </Text>
          <Text size="sm" c="dimmed" fw={400} data-testid="event-location">
            {location}
          </Text>
        </Grid.Col>
        <Grid.Col span={5}>
          <Group align="right">
            {!me && <GotoLoginButton />}
            {me && (
              <ToggleJoinButton isParticipating={meAttending} eventId={id} />
            )}
          </Group>
        </Grid.Col>
      </Grid>
      {children}
    </Card>
  )
}
