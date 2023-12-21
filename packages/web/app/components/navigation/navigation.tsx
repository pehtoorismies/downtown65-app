import { Avatar, Burger, Button, Group, Menu, Text } from '@mantine/core'
import { Form, Link, NavLink, useFetcher } from '@remix-run/react'
import { IconChevronDown, IconLogout, IconUser } from '@tabler/icons-react'
import cx from 'clsx'
import type { User } from '~/domain/user'
import classes from '~/routes-styles/root.module.css'

const SIDE_COL_WIDTH = 130

const navLinks = [
  { id: 10, title: 'Tapahtumat', to: '/events' },
  // { id: 20, title: 'Haasteet', to: '/challenges' },
  {
    id: 30,
    title: 'Luo uusi',
    to: '/events/new',
    // to: '/create',
    testId: 'nav-create-new-event',
  },
  { id: 40, title: 'Jäsenet', to: '/members' },
]

interface LoggedInProps {
  user: User
  toggle: () => void
  close: () => void
  navigationOpened: boolean
}

export const LoggedIn = ({
  user,
  toggle,
  close,
  navigationOpened,
}: LoggedInProps) => {
  const fetcher = useFetcher()

  return (
    <Group h="100%" px="md" wrap="nowrap">
      <Burger
        opened={navigationOpened}
        onClick={toggle}
        hiddenFrom="sm"
        size="sm"
      />
      <Group gap={0} style={{ flex: 1 }} justify="space-between" wrap="nowrap">
        <Group style={{ width: SIDE_COL_WIDTH }}>
          <Text
            style={{
              userSelect: 'none',
            }}
          >
            Dt65 Events
          </Text>
        </Group>
        <Group
          gap={5}
          visibleFrom="sm"
          justify="center"
          style={{
            flex: 1,
          }}
        >
          {navLinks.map(({ id, to, title, testId }) => (
            <NavLink
              key={id}
              className={({ isActive }) => {
                return cx(
                  classes.control,
                  classes.controlDesktop,
                  isActive && classes.active
                )
              }}
              to={to}
              data-testid={testId}
              end
            >
              {title}
            </NavLink>
          ))}
        </Group>
        <Menu
          width={160}
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
        >
          <Menu.Target>
            <Group
              justify="flex-end"
              style={{
                width: SIDE_COL_WIDTH,
              }}
            >
              <Button
                variant="subtle"
                // color="black"
                leftSection={
                  <Avatar
                    src={user.picture}
                    alt={user.nickname}
                    radius="xl"
                    size={20}
                  />
                }
                rightSection={<IconChevronDown size={12} stroke={1.5} />}
              >
                {user.nickname}
              </Button>
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              component={Link}
              onClick={close}
              to="/profile"
              leftSection={<IconUser size={14} stroke={1.5} />}
            >
              Profiili
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                close()
                fetcher.submit({}, { action: '/logout', method: 'post' })
              }}
              leftSection={<IconLogout size={14} stroke={1.5} />}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}

export const LoggedOut = () => {
  return (
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

interface NavbarProps {
  close: () => void
}

export const Navbar = ({ close }: NavbarProps) => {
  return (
    <>
      {navLinks.map(({ id, to, title, testId }) => {
        return (
          <NavLink
            key={id}
            className={({ isActive }) => {
              return cx(
                classes.control,
                classes.controlMobile,
                isActive && classes.active
              )
            }}
            to={to}
            onClick={close}
            data-testid={testId}
            end
          >
            {title}
          </NavLink>
        )
      })}
      <Group justify="center" grow pb="xl" px="md">
        <Form action="/logout" method="post">
          <Button
            my="md"
            type="submit"
            onClick={close}
            leftSection={<IconLogout size={18} />}
            fullWidth
          >
            Kirjaudu ulos
          </Button>
        </Form>
      </Group>
    </>
  )
}
