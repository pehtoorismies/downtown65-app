import { Avatar, Group, Progress, Stack, Text } from '@mantine/core'
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
    <Group>
      <Text mx="sm">{position}</Text>
      <Avatar src={participant.picture} alt="User avatar" />
      <Stack style={{ width: 200 }} gap={2}>
        <Text>{participant.nickname}</Text>
        <Progress value={progress} size="xs" />
      </Stack>
      <Text>{daysDone}</Text>
    </Group>
  )
}
