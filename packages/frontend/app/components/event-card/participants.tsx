import { Badge, Group, ThemeIcon, Text } from '@mantine/core'
import { IconUserOff } from '@tabler/icons'
import { Gradient } from '~/components/colors'
import type { User } from '~/domain/user'

interface Props {
  participants: User[]
  me?: User
}

export const Participants = ({ me, participants }: Props) => {
  if (participants.length === 0) {
    return (
      <Group position="center" p="md">
        <ThemeIcon color="gray.4 " size="lg">
          <IconUserOff />
        </ThemeIcon>
        <Text color="dimmed">Tapahtumassa ei osallistujia</Text>
      </Group>
    )
  }

  return (
    <Group position="left" spacing={2}>
      {participants.map((p) => {
        const gradient =
          me?.id === p.id
            ? Gradient.dtPink
            : { from: 'indigo', to: 'blue', deg: 45 }

        return (
          <Badge
            m={2}
            radius="sm"
            key={p.id}
            styles={{ inner: { textTransform: 'none' } }}
            variant="gradient"
            gradient={gradient}
          >
            {p.nickname}
          </Badge>
        )
      })}
    </Group>
  )
}
