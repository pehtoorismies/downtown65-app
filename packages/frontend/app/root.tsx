import { MantineProvider, createEmotionCache, Title } from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { RouteMatch } from '@remix-run/react'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useCatch,
  useMatches,
} from '@remix-run/react'
import { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Layout } from '~/components/layout'
import type { User } from '~/domain/user'
import type { ToastMessage } from '~/message.server'
import { commitMessageSession, getMessageSession } from '~/message.server'
import { theme } from '~/theme'

type LoaderData = {
  stage: string
  toastMessage: ToastMessage | undefined
}

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

export const loader: LoaderFunction = async ({ request }) => {
  const stage = getStage()

  const session = await getMessageSession(request.headers.get('cookie'))
  const toastMessage = session.get('toastMessage') as ToastMessage

  if (!toastMessage) {
    return json<LoaderData>({ toastMessage: undefined, stage })
  }

  return json<LoaderData>(
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

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Downtown65 Events',
  viewport: 'width=device-width,initial-scale=1',
})

createEmotionCache({ key: 'mantine' })

const findUser = (matches: RouteMatch[]): User | undefined => {
  return matches
    .map((match) => match.data)
    .filter(Boolean)
    .map(({ user }) => user)
    .find(Boolean)
}

export default function App() {
  const { stage, toastMessage } = useLoaderData<LoaderData>()
  const matches = useMatches()
  const user = findUser(matches)

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
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body>
          <Layout user={user} stage={stage}>
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

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <Title>
      {caught.status} {caught.statusText}
    </Title>
  )
}
