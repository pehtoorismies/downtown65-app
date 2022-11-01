import { MantineProvider, createEmotionCache } from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import type { User } from '~/domain/user'
import { HeaderMenu } from '~/header'
import type { ToastMessage } from '~/message.server'
import { commitSession, getSession } from '~/message.server'
import { validateSessionUser } from '~/session.server'

type LoaderData = {
  toastMessage?: ToastMessage
  user?: User
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)
  const user = result.hasSession ? result.user : undefined

  const session = await getSession(request.headers.get('cookie'))

  const toastMessage = session.get('toastMessage') as ToastMessage

  if (!toastMessage) {
    return json<LoaderData>({ toastMessage: undefined })
  }

  if (!toastMessage.type) {
    throw new Error('Message should have a type')
  }

  return json<LoaderData>(
    { toastMessage, user },
    { headers: { 'Set-Cookie': await commitSession(session) } }
  )
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Downtown65 Events',
  viewport: 'width=device-width,initial-scale=1',
})

createEmotionCache({ key: 'mantine' })

interface LayoutProps {
  user?: User
}

const Layout = ({ children, user }: PropsWithChildren<LayoutProps>) => {
  return (
    <div className="remix-app">
      <HeaderMenu user={user} />
      <div>{children}</div>
      <footer className="remix-app__footer">
        <div className="container remix-app__footer-content">
          <p>&copy; You!</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const { toastMessage, user } = useLoaderData<LoaderData>()

  useEffect(() => {
    if (!toastMessage) {
      return
    }
    const { message, type } = toastMessage

    switch (type) {
      case 'success': {
        toast.success(message, { duration: 3000 })
        break
      }
      case 'error': {
        toast.error(message)
        break
      }
      default: {
        throw new Error(`${type} is not handled`)
      }
    }
  }, [toastMessage])

  return (
    <MantineProvider
      theme={{
        colorScheme: 'light',
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
            h1: { fontSize: 30 },
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body>
          <Layout user={user}>
            <Toaster />
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  )
}
