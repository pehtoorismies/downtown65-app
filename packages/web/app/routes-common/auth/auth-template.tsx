import { Container, Title } from '@mantine/core'
import type { PropsWithChildren } from 'react'

interface Props {
  title: string
}

export const AuthTemplate = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <Container size={420} py="sm">
      <Title
        ta="center"
        fw={900}
        // TODO: fix below
        // sx={(theme) => ({
        //   fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        //   fontWeight: 900,
        // })}
      >
        {title}
      </Title>
      {children}
    </Container>
  )
}
