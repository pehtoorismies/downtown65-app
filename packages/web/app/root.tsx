import '@mantine/core/styles.css'
import '@mantine/tiptap/styles.css'
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  ColorSchemeScript,
  Group,
  MantineProvider,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Notifications, notifications } from '@mantine/notifications'
import { cssBundleHref } from '@remix-run/css-bundle'
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from '@remix-run/react'
import { IconChevronDown, IconLogout, IconUser } from '@tabler/icons-react'
import cx from 'clsx'
import { useEffect } from 'react'
import classes from './routes-styles/root.module.css'
import type { User } from '~/domain/user'
import type { ToastMessage } from '~/message.server'
import { commitMessageSession, getMessageSession } from '~/message.server'
import { theme } from '~/routes-styles/theme'

const ONE_YEAR = 1000 * 60 * 60 * 24 * 36

export const getStage = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'local-development'
  }
  const value = process.env['SST_STAGE']
  if (!value) {
    throw new Error(`Environment value 'process.env.SST_STAGE' is not set`)
  }
  return value
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const stage = getStage()

  const session = await getMessageSession(request.headers.get('cookie'))
  const toastMessage = session.get('toastMessage') as ToastMessage

  if (!toastMessage) {
    return json({ toastMessage: null, stage })
  }

  return json(
    { toastMessage, stage },
    {
      headers: {
        'Set-Cookie': await commitMessageSession(session, {
          expires: new Date(Date.now() + ONE_YEAR),
        }),
      },
    }
  )
}

export const meta: MetaFunction = () => [
  {
    title: 'Downtown65 Events',
    description: 'Events calendar for Downtown 65 Endurance ry',
    'msapplication-TileColor': '#da532c',
    'theme-color': '#ffffff',
  },
]

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
    {
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color: '#5bbad5',
    },
  ]
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

const SIDE_COL_WIDTH = 130

interface UserData {
  user?: User
}

export default function App() {
  const { stage, toastMessage } = useLoaderData<typeof loader>()
  const matches = useMatches()
  const [opened, { toggle }] = useDisclosure()

  useEffect(() => {
    if (!toastMessage) {
      return
    }
    const { message, type } = toastMessage

    switch (type) {
      case 'success': {
        notifications.show({ message, color: 'green', autoClose: 2500 })
        break
      }
      case 'error': {
        notifications.show({ message, color: 'red', autoClose: 2500 })
        break
      }
      default: {
        throw new Error(`${type} is not handled`)
      }
    }
  }, [toastMessage])

  const user = matches
    .map((matches) => matches.data as UserData)
    .filter(Boolean)
    .map(({ user }: UserData) => user)
    .find(Boolean)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
              width: 300,
              breakpoint: 'sm',
              collapsed: { desktop: true, mobile: !opened },
            }}
            padding="xs"
          >
            <AppShell.Header>
              {user && (
                <Group h="100%" px="md" wrap="nowrap">
                  <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                  />
                  <Group
                    gap={0}
                    style={{ flex: 1 }}
                    justify="space-between"
                    wrap="nowrap"
                  >
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
                            variant="transparent"
                            color="black"
                            leftSection={
                              <Avatar
                                src={user.picture}
                                alt={user.nickname}
                                radius="xl"
                                size={20}
                              />
                            }
                            rightSection={
                              <IconChevronDown size={12} stroke={1.5} />
                            }
                          >
                            {user.nickname}
                          </Button>
                        </Group>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          component={Link}
                          to="/profile"
                          leftSection={<IconUser size={14} stroke={1.5} />}
                        >
                          Profiili
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            // fetcher.submit(
                            //   {},
                            //   { action: '/logout', method: 'post' }
                            // )
                          }}
                          leftSection={<IconLogout size={14} stroke={1.5} />}
                        >
                          Logout
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Group>
              )}
              {!user && (
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
                      <Button
                        component={Link}
                        to="/signup"
                        data-testid="button-to-signup"
                      >
                        Rekisteröidy
                      </Button>
                    </Group>
                  </Group>
                </Group>
              )}
            </AppShell.Header>
            <AppShell.Navbar py="md" px={4}>
              <UnstyledButton>Home</UnstyledButton>
              <UnstyledButton>Blog</UnstyledButton>
              <UnstyledButton>Contacts</UnstyledButton>
              <UnstyledButton>Support</UnstyledButton>
            </AppShell.Navbar>
            <AppShell.Main>
              <Notifications
                position="top-center"
                zIndex={3000}
                containerWidth={300}
              />
              <Outlet />
            </AppShell.Main>
          </AppShell>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  )
}
