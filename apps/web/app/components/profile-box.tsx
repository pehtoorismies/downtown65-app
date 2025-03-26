import { Avatar, Paper, Text } from '@mantine/core'
import type { FC, PropsWithChildren } from 'react'

type Properties = PropsWithChildren<{
  picture: string
  nickname: string
  name: string
  email: string
}>

export const ProfileBox: FC<Properties> = ({
  picture,
  name,
  nickname,
  email,
}: Properties) => {
  return (
    <Paper p="sm">
      <Avatar src={picture} size={120} radius={120} mx="auto" />
      <Text
        ta="center"
        fz={30}
        variant="gradient"
        gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
        fw={700}
        mt="md"
        data-testid="profile-nick"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        {nickname}
      </Text>
      <Text ta="center" fw={500} fz="md" data-testid="profile-name">
        {name}
      </Text>
      <Text ta="center" fw={500} fz="sm" c="dimmed" data-testid="profile-email">
        {email}
      </Text>
    </Paper>
  )
}
