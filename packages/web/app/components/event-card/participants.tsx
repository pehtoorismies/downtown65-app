import { Avatar, Badge, Group, Text, ThemeIcon } from '@mantine/core'
import { IconUserOff } from '@tabler/icons-react'
import { Gradient } from '~/components/colors'
import { useUserContext } from '~/contexts/user-context'
import type { User } from '~/domain/user'

interface Props {
  participants: User[]
}

export const Participants = ({ participants }: Props) => {
  const { user } = useUserContext()

  if (participants.length === 0) {
    return (
      <Group justify="center" p="md">
        <ThemeIcon color="gray.4 " size="lg">
          <IconUserOff />
        </ThemeIcon>
        <Text c="dimmed">Tapahtumassa ei osallistujia</Text>
      </Group>
    )
  }

  return (
    <Group align="left" gap={2}>
      {participants.map((p) => {
        const gradient =
          user?.id === p.id
            ? Gradient.dtPink
            : { from: 'indigo', to: 'blue', deg: 45 }

        return (
          <Badge
            data-testid="event-participant"
            m={2}
            radius="md"
            key={p.id}
            styles={{ label: { textTransform: 'none' } }}
            variant="gradient"
            style={{ paddingLeft: 0 }}
            gradient={gradient}
            leftSection={
              <Avatar alt="Avatar for badge" size={24} mr={5} src={p.picture} />
            }
          >
            {p.nickname}
          </Badge>
        )
      })}
    </Group>
  )
}
