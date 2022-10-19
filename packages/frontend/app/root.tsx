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
import { HeaderMegaMenu } from '~/header'
import type { ToastMessage } from '~/message.server'
import { commitSession, getSession } from '~/message.server'

type LoaderData = {
  toastMessage: ToastMessage | undefined
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('cookie'))

  const toastMessage = session.get('toastMessage') as ToastMessage

  if (!toastMessage) {
    return json<LoaderData>({ toastMessage: undefined })
  }

  if (!toastMessage.type) {
    throw new Error('Message should have a type')
  }

  return json<LoaderData>(
    { toastMessage },
    { headers: { 'Set-Cookie': await commitSession(session) } }
  )
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Downtown65 Events',
  viewport: 'width=device-width,initial-scale=1',
})

createEmotionCache({ key: 'mantine' })

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="remix-app">
      <HeaderMegaMenu />
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
  const { toastMessage } = useLoaderData<LoaderData>()

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
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
            '#FF80EA',
          ],
          // blue: '#00acee'
          // Add your color
          // deepBlue: ['#E9EDFC', '#C1CCF6', '#99ABF0' /* ... */],
          // or replace default theme color
          // blue: ['#E9EDFC', '#C1CCF6', '#99ABF0' /* ... */],
        },

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
          <Layout>
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
