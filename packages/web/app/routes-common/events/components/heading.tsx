import { Title } from '@mantine/core'
import type { PropsWithChildren } from 'react'

export const Heading = ({ children }: PropsWithChildren) => {
  return (
    <Title ta="center" order={2} size="h3" mb="xs">
      {children}
    </Title>
  )
}
