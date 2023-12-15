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

VoucherHeader.Title = ({ children }: PropsWithChildren) => {
  return (
    <Box className={classes.areaTitle}>
      <Text className={classes.title} data-testid="event-title">
        {children}
      </Text>
    </Box>
  )
}

VoucherHeader.Creator = ({ nick }: { nick: string }) => {
  return (
    <Badge
      m={0}
      py="xs"
      px={4}
      className={classes.areaCreator}
      styles={{ label: { textTransform: 'none' } }}
      size="md"
      radius="xs"
      variant="outline"
      color="blue.0"
      data-testid="event-created-by"
    >
      by #{nick}
    </Badge>
  )
}
VoucherHeader.Icon = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <ThemeIcon
      data-testid="event-race"
      m={0}
      py="xs"
      px={4}
      className={classes.areaCompetition}
      size="md"
      radius="xs"
      variant="outline"
      color="blue.0"
    >
      {icon}
    </ThemeIcon>
  )
}

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
          <IconUsers size={18} />
        </Center>
      }
      radius="sm"
      variant={highlighted ? 'gradient' : 'filled'}
      gradient={Gradient.dtPink}
      className={classes.areaParticipantCount}
    >
      {count}
    </Badge>
  )
}

VoucherHeader.ParticipantCount = ParticipantCount
