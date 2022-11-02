import { Box } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import { HeaderMenu } from '~/components/header-menu'
import type { User } from '~/domain/user'

interface LayoutProps {
  user?: User
}

export const Layout = ({ children, user }: PropsWithChildren<LayoutProps>) => {
  return (
    <>
      <HeaderMenu user={user} />
      <Box mt={60}>{children}</Box>
    </>
  )
}
