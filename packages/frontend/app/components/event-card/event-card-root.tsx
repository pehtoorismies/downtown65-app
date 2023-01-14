import type { MantineShadow } from '@mantine/core'
import {
  Card,
  Text,
  createStyles,
  BackgroundImage,
  Center,
  Badge,
  ThemeIcon,
  Box,
  Grid,
  Group,
} from '@mantine/core'
import { IconMedal, IconUsers } from '@tabler/icons'
import type { PropsWithChildren } from 'react'
import { Gradient } from '~/components/colors'
import {
  GotoLoginButton,
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

  grid: {
    display: 'grid',
    gridTemplateColumns: '100px auto 100px',
    gridTemplateRows: '30px 80px 30px',
    gap: '15px 15px',
    gridTemplateAreas: `
"topLeft . topRight"
"main main main"
"bottomLeft . bottomRight"
`,
  },
  gridTitle: {
    gridArea: 'main',
    alignSelf: 'center',
  },
  gridTitleText: {
    textShadow: 'black 2px 2px 10px',
    fontWeight: 700,
    letterSpacing: '4px',
    background:
      'linear-gradient(0deg, rgba(134, 142, 150,0.1) 0%, rgba(134, 142, 150,0.3) 25%, rgba(134, 142, 150,0.3) 75%, rgba(134, 142, 150,0.1) 100%)',
  },
  gridMeIn: {
    gridArea: 'bottomLeft',
    justifySelf: 'start',
    alignSelf: 'end',
    background: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
  },
  gridCount: {
    gridArea: 'topRight',
    pointerEvents: 'none',
    justifySelf: 'end',
  },
  gridRace: {
    gridArea: 'topLeft',
    background: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
  },
  gridCreator: {
    gridArea: 'bottomRight',
    opacity: 0.8,
    justifySelf: 'end',
    alignSelf: 'end',
    background: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
  },
}))

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
  const { classes, cx } = useStyles()
  const meAttending =
    me !== undefined && participants.map(({ id }) => id).includes(me.id)

  const { imageUrl } = mapToData(type)
  const count = participants.length

  const time = timeStart ? `klo ${timeStart}` : ''

  return (
    <Card withBorder radius="md" className={cx(classes.card)} shadow={shadow}>
      <Card.Section>
        <BackgroundImage src={imageUrl}>
          <Box className={classes.grid}>
            <Box className={classes.gridTitle}>
              <Text
                align="center"
                color="#fff"
                size={23}
                className={classes.gridTitleText}
                data-cy="event-title"
              >
                {title}
              </Text>
            </Box>
            <Badge
              m={BADGE_MARGIN}
              py="xs"
              px={4}
              className={classes.gridCreator}
              styles={{ inner: { textTransform: 'none' } }}
              size="md"
              radius="xs"
              variant="outline"
              color="blue.0"
              data-cy="created-by"
            >
              by #{createdBy.nickname}
            </Badge>
            <Badge
              data-cy="event-participant-count"
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
                data-cy="event-race"
                m={BADGE_MARGIN}
                py="xs"
                px={4}
                className={classes.gridRace}
                styles={{ inner: { textTransform: 'none' } }}
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
          <Text weight={700} mt={2} data-cy="event-subtitle">
            {subtitle}
          </Text>
          <Text size="sm" weight={500} data-cy="event-date">
            {dateStart} {time}
          </Text>
          <Text size="sm" color="dimmed" weight={400} data-cy="event-location">
            {location}
          </Text>
        </Grid.Col>
        <Grid.Col span={5}>
          <Group position="right">
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
