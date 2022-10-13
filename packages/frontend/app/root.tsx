import { MantineProvider, createEmotionCache } from '@mantine/core'
import { StylesPlaceholder } from '@mantine/remix'
import type { MetaFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import type { PropsWithChildren } from 'react'
import { HeaderMegaMenu } from '~/header'

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
