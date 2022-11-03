import { Box } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import { HeaderLoggedIn } from '~/components/header-logged-in'
import { HeaderLoggedOut } from '~/components/header-logged-out'
import type { User } from '~/domain/user'

interface LayoutProps {
  user?: User
}

export const Layout = ({ children, user }: PropsWithChildren<LayoutProps>) => {
  return (
    <>
      {!user && <HeaderLoggedOut />}
      {user && <HeaderLoggedIn user={user} />}
      <Box mt={60}>{children}</Box>
    </>
  )
}
