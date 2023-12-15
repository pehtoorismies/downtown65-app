import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import '@mantine/nprogress/styles.css'

import {
  AppShell,
  ColorSchemeScript,
  MantineProvider,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Notifications, notifications } from '@mantine/notifications'
import { NavigationProgress, nprogress } from '@mantine/nprogress'
import { cssBundleHref } from '@remix-run/css-bundle'
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useNavigation,
} from '@remix-run/react'
import { useEffect } from 'react'
import classes from './routes-styles/root.module.css'
import { LoggedIn, LoggedOut, Navbar } from '~/components/navigation/navigation'
import { UserContext } from '~/contexts/user-context'
import type { User } from '~/domain/user'
import type { ToastMessage } from '~/message.server'
import { commitMessageSession, getMessageSession } from '~/message.server'
import { theme } from '~/routes-styles/theme'

const ONE_YEAR = 1000 * 60 * 60 * 24 * 36

export const getStage = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'local-development'
  }
  const value = process.env['APP_STAGE']
  if (!value) {
    throw new Error(`Environment value 'process.env.APP_STAGE' is not set`)
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

interface UserData {
  user?: User
}

export default function App() {
  const { stage, toastMessage } = useLoaderData<typeof loader>()
  const matches = useMatches()
  const navigation = useNavigation()
  const [navigationOpened, { toggle, close }] = useDisclosure()

  useEffect(() => {
    if (!toastMessage) {
      return
    }
    const { message, type } = toastMessage

    switch (type) {
      case 'success': {
        notifications.show({ message, color: 'green', autoClose: 1500 })
        break
      }
      case 'error': {
        notifications.show({ message, color: 'red', autoClose: 1500 })
        break
      }
      default: {
        throw new Error(`${type} is not handled`)
      }
    }
  }, [toastMessage])

  useEffect(() => {
    if (navigation.state === 'loading') {
      nprogress.start()
    } else {
      nprogress.complete()
    }
  }, [navigation.state])

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
          <NavigationProgress stepInterval={250} size={2} />
          <Notifications
            position="top-right"
            zIndex={3000}
            containerWidth={300}
          />

          <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
              width: 300,
              breakpoint: 'sm',
              collapsed: { desktop: true, mobile: !navigationOpened },
            }}
            padding="xs"
          >
            <AppShell.Header>
              {stage !== 'production' && (
                <Text className={classes.stage}>{stage}</Text>
              )}
              {user && (
                <LoggedIn
                  user={user}
                  toggle={toggle}
                  close={close}
                  navigationOpened={navigationOpened}
                />
              )}
              {!user && <LoggedOut />}
            </AppShell.Header>
            <AppShell.Navbar py="md" p="sm">
              <Navbar close={close} />
            </AppShell.Navbar>
            <AppShell.Main>
              <UserContext.Provider value={{ user }}>
                <Outlet />
              </UserContext.Provider>
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
