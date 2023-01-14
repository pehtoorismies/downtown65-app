import { Badge, Group, ThemeIcon, Text, Avatar } from '@mantine/core'
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
            data-cy="event-participant"
            m={2}
            radius="md"
            key={p.id}
            styles={{ inner: { textTransform: 'none' } }}
            variant="gradient"
            sx={{ paddingLeft: 0 }}
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
