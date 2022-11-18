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
} from '@mantine/core'
import { IconMedal, IconUsers } from '@tabler/icons'
import type { PropsWithChildren } from 'react'
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

const getVariant = (min: number, max: number, count: number): number => {
  // 5..9
  if (min > max) {
    throw new Error('Wrong min max in variants')
  }
  if (count > max) {
    return 9
  }
  if (count < min) {
    return 5
  }
  const result = count / (max - min + 1)
  if (result < 0.2) {
    return 9
  }
  if (result < 0.4) {
    return 8
  }
  if (result < 0.6) {
    return 7
  }
  if (result < 0.8) {
    return 6
  }
  return 5
}

const getColor = (count: number) => {
  if (count <= 5) {
    return `red.${getVariant(0, 5, count)}`
  } else if (count <= 10) {
    return `orange.${getVariant(5, 10, count)}`
  } else if (count <= 15) {
    return `teal.6`
  } else if (count <= 25) {
    return `teal.8`
  } else {
    return 'lime.9'
  }
}

export interface EventCardRootProps extends ParticipantProps {
  createdBy: User
  dateStart: string
  id?: string
  isRace: boolean
  location: string
  shadow?: MantineShadow
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
  timeStart,
  title,
  type,
}: PropsWithChildren<EventCardRootProps>) => {
  const { classes, cx } = useStyles()
  const meAttending =
    me !== undefined && participants.map(({ id }) => id).includes(me.id)

  const { imageUrl } = mapToData(type)
  const count = participants.length

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
            >
              #{createdBy.nickname}
            </Badge>
            <Badge
              m={BADGE_MARGIN}
              size="lg"
              leftSection={
                <Center>
                  <IconUsers size={18} />
                </Center>
              }
              radius="sm"
              color={getColor(count)}
              variant="filled"
              className={classes.gridCount}
            >
              {participants.length}
            </Badge>
            {isRace && (
              <ThemeIcon
                m={BADGE_MARGIN}
                className={classes.gridRace}
                size="lg"
                color="blue.1"
                variant="outline"
              >
                <IconMedal color="white" />
              </ThemeIcon>
            )}
          </Box>
        </BackgroundImage>
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
              {dateStart}
            </Text>
            {timeStart && (
              <Text size="sm" weight={500}>
                klo: {timeStart}
              </Text>
            )}
            {!timeStart && (
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
