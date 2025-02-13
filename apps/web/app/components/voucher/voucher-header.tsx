import {
  BackgroundImage,
  Badge,
  Box,
  Card,
  Center,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconUsers } from '@tabler/icons-react'
import type { PropsWithChildren } from 'react'
import classes from './voucher.module.css'
import { Gradient } from '~/components/colors'

export const VoucherHeader = ({
  children,
  bgImageUrl,
}: PropsWithChildren<{ bgImageUrl: string }>) => {
  return (
    <Card.Section>
      <BackgroundImage src={bgImageUrl}>
        <Box className={classes.header}>{children}</Box>
      </BackgroundImage>
    </Card.Section>
  )
}

VoucherHeader.displayName = 'VoucherHeader'

const Title = ({ children }: PropsWithChildren) => {
  return (
    <Box className={classes.areaTitle}>
      <Text className={classes.title} data-testid="event-title">
        {children}
      </Text>
    </Box>
  )
}
Title.displayName = 'VoucherTitle'

const Type = ({ type }: { type: string }) => {
  return (
    <Badge
      className={classes.type}
      styles={{ label: { textTransform: 'none' } }}
      size="md"
      color="violet"
      data-testid="event-type"
    >
      {type}
    </Badge>
  )
}
Type.displayName = 'VoucherType'

const Creator = ({ nick }: { nick: string }) => {
  return (
    <Badge
      className={classes.areaCreator}
      styles={{ label: { textTransform: 'none' } }}
      size="sm"
      color="blue.0"
      data-testid="event-created-by"
    >
      created by #{nick}
    </Badge>
  )
}
Creator.displayName = 'VoucherCreator'

const Icon = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <ThemeIcon
      data-testid="event-race"
      className={classes.areaCompetition}
      size="md"
      radius="xs"
      variant="filled"
      color="grape"
    >
      {icon}
    </ThemeIcon>
  )
}
Icon.displayName = 'VoucherIcon'

const ParticipantCount = ({
  count,
  highlighted,
}: {
  count: number
  highlighted: boolean
}) => {
  return (
    <Badge
      data-testid="event-participant-count"
      m={0}
      size="lg"
      leftSection={
        <Center>
          <IconUsers size={16} />
        </Center>
      }
      radius="xs"
      variant={highlighted ? 'gradient' : 'filled'}
      gradient={Gradient.dtPink}
      className={classes.areaParticipantCount}
    >
      {count}
    </Badge>
  )
}
ParticipantCount.displayName = 'VoucherParticipantCount'

VoucherHeader.ParticipantCount = ParticipantCount
VoucherHeader.Title = Title
VoucherHeader.Type = Type
VoucherHeader.Creator = Creator
VoucherHeader.Icon = Icon
