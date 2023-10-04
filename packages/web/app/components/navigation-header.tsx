import { Burger, Button, Group, Text, UnstyledButton } from '@mantine/core'
import { Link } from '@remix-run/react'
import type { User } from '~/domain/user'

interface Props {
  user: User
  opened: boolean
  toggle: () => void
}

const navLinks = [
  { id: 10, title: 'Tapahtumat', to: '/events' },
  {
    id: 30,
    title: 'Luo uusi',
    to: '/events/new',
    testId: 'nav-create-new-event',
  },
  { id: 40, title: 'Jäsenet', to: '/members' },
]

export const NavigationHeader = ({ user, toggle, opened }: Props) => {
  return user ? (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <Text style={{ userSelect: 'none' }}>Dt65 Events</Text>
        <Group ml="xl" gap={0} visibleFrom="sm">
          {navLinks.map(({ id, to, title, testId }) => (
            <UnstyledButton
              component="a"
              key={id}
              // label={title}
              // active
              // end
              // to={to}
              // className={({ isActive }) => {
              //   return cx(classes.link, {
              //     [classes.linkActive]: isActive,
              //   })
              // }}
              data-testid={testId}
            >
              {title}
            </UnstyledButton>
          ))}
        </Group>
        <Group ml="xl" gap={0} visibleFrom="sm">
          <UnstyledButton>Home</UnstyledButton>
          <UnstyledButton>Blog</UnstyledButton>
          <UnstyledButton>Contacts</UnstyledButton>
          <UnstyledButton>Support</UnstyledButton>
        </Group>
      </Group>
    </Group>
  ) : (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        <Text style={{ userSelect: 'none' }}>Dt65 Events</Text>
        <Group ml="xl" gap={10} visibleFrom="sm">
          <Button
            component={Link}
            to="/login"
            variant="default"
            data-testid="button-to-login"
          >
            Kirjaudu
          </Button>
          <Button component={Link} to="/signup" data-testid="button-to-signup">
            Rekisteröidy
          </Button>
        </Group>
      </Group>
    </Group>
  )
}
