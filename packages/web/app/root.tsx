import '@mantine/core/styles.css'

import {
  AppShell,
  ColorSchemeScript,
  MantineProvider,
  createTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Notifications, notifications } from '@mantine/notifications'
// import { StylesPlaceholder } from '@mantine/remix'
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
} from '@remix-run/react'
import { useEffect } from 'react'
import type { User } from '~/domain/user'
import type { ToastMessage } from '~/message.server'
import { commitMessageSession, getMessageSession } from '~/message.server'

const theme = createTheme({
  colors: {
    dtPink: [
      '#F7D9F2',
      '#F6AFEA',
      '#FF80EA', // original
      '#EE6AD9',
      '#DB5BC6',
      '#C751B3',
      '#B14AA0',
      '#964C8A',
      '#804B78',
      '#804B78',
    ],
  },
  defaultGradient: { from: 'indigo', to: 'cyan', deg: 45 },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  components: {
    Container: {
      defaultProps: {
        sizes: {
          xs: 540,
          sm: 720,
          md: 960,
          lg: 1140,
          xl: 1320,
        },
      },
    },
  },
  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: '2rem' },
    },
  },
})

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

  const user = matches
    .map((matches) => matches.data as UserData)
    .filter(Boolean)
    .map(({ user }: UserData) => user)
    .find(Boolean)

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

  const [opened, { toggle }] = useDisclosure()

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
          <ColorSchemeScript />
        </head>
        <body>
          <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            navbar={{
              width: { base: 200, md: 300, lg: 400 },
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Main>
              <Notifications
                position="top-center"
                zIndex={3000}
                containerWidth={300}
              />
              <Outlet />
            </AppShell.Main>
          </AppShell>
          {/*<Layout user={user} stage={stage}>*/}
          {/*  <Notifications*/}
          {/*    position="top-center"*/}
          {/*    zIndex={3000}*/}
          {/*    containerWidth={300}*/}
          {/*  />*/}
          {/*  <Outlet />*/}
          {/*</Layout>*/}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  )
}
