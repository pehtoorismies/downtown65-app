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

  grid: {
    display: 'grid',
    gridTemplateColumns: '100px auto 100px',
    gridTemplateRows: '50px auto 50px',
    gap: '15px 15px',
    gridTemplateAreas: `
"topLeft . topRight"
"main main main"
"bottomLeft footer bottomRight"
`,
  },
  gridTitle: {
    gridArea: 'main',
    textShadow: 'black 2px 2px 10px',
    fontWeight: 700,
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  gridCount: {
    gridArea: 'topRight',
    pointerEvents: 'none',
    backgroundColor: 'orange',
    justifySelf: 'end',
  },
  gridRace: {
    gridArea: 'topLeft',
    boxShadow: '3px 3px 16px #888888',
  },
  gridCreator: {
    gridArea: 'bottomRight',
    opacity: 0.8,
    justifySelf: 'end',
    alignSelf: 'end',
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
  timeStart?: string
  title: string
  type: EventType
}

const BADGE_MARGIN = 'xs'

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
  const gradient = meAttending ? Gradient.dtPink : Gradient.blue
  const { text, imageUrl } = mapToData(type)

  return (
    <Card withBorder radius="md" className={cx(classes.card)} shadow={shadow}>
      <Card.Section>
        <BackgroundImage src={imageUrl}>
          <Box className={classes.grid}>
            <Text
              align="center"
              color="#fff"
              size={30}
              className={classes.gridTitle}
            >
              {text}
            </Text>
            <Badge
              m={BADGE_MARGIN}
              py="xs"
              px={4}
              className={classes.gridCreator}
              styles={{ inner: { textTransform: 'none' } }}
              size="md"
              radius="xs"
              variant="gradient"
              gradient={meAttending ? Gradient.dtPink : Gradient.blue}
              // leftSection={
              //   <Avatar alt="Creator image" size={18} src={createdBy.picture} />
              // }
            >
              #created {createdBy.nickname}
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
              className={classes.gridCount}
              variant="gradient"
              gradient={gradient}
            >
              {participants.length}
            </Badge>
            {isRace && (
              <ThemeIcon
                m={BADGE_MARGIN}
                className={classes.gridRace}
                size="lg"
                gradient={gradient}
                variant="gradient"
              >
                <IconMedal />
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
