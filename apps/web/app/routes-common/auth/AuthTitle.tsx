import { Title } from '@mantine/core'
import type { PropsWithChildren } from 'react'

interface Props {
  title: string
}

export const AuthTitle = ({ title }: PropsWithChildren<Props>) => {
  return (
    <Title ta="center" fw={900}>
      {title}
    </Title>
  )
}
