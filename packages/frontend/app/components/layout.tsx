import { Box } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import { HeaderLoggedIn } from '~/components/header-logged-in'
import { HeaderLoggedOut } from '~/components/header-logged-out'
import type { User } from '~/domain/user'

interface LayoutProps {
  user?: User
  stage: string
}

export const Layout = ({
  children,
  user,
  stage,
}: PropsWithChildren<LayoutProps>) => {
  return (
    <>
      {stage !== 'production' && (
        <Box
          sx={{
            position: 'fixed',
            fontSize: 8,
            padding: 2,
            top: 0,
            right: 0,
            zIndex: 1_000_001,
            userSelect: 'none',
          }}
        >
          stage: {stage}
        </Box>
      )}
      {!user && <HeaderLoggedOut />}
      {user && <HeaderLoggedIn user={user} />}
      <Box mt={60}>{children}</Box>
    </>
  )
}
