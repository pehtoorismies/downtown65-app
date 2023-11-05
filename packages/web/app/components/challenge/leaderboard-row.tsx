import { Avatar, Grid, Group, Progress, Stack, Text } from '@mantine/core'
import type { ChallengeParticipant } from '~/domain/user'

interface Props {
  position: number
  participant: ChallengeParticipant
  daysTotal: number
  daysDone: number
}

export const LeaderboardRow = ({
  position,
  participant,
  daysDone,
  daysTotal,
}: Props) => {
  const progress = Math.round((daysDone / daysTotal) * 100)

  return (
    <Grid align="center" gutter="md" px="sm">
      <Grid.Col span="content">
        <Group justify="flex-end">
          <Text fw={500}>{position}</Text>
          <Avatar src={participant.picture} alt="User avatar" />
        </Group>
      </Grid.Col>
      <Grid.Col span="auto">
        <Stack gap={2}>
          <Text>{participant.nickname}</Text>
          <Progress value={progress} size="sm" />
        </Stack>
      </Grid.Col>
      <Grid.Col span="content">
        <Text>
          {daysDone} / {daysTotal}
        </Text>
      </Grid.Col>
    </Grid>
  )
}
