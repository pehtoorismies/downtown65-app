import { Container } from '@mantine/core'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { honeypot } from '~/honeypot.server'

export const loader = async () => {
  return json({ honeypotInputProps: honeypot.getInputProps() })
}

export default function AuthRoot() {
  const honeypotInputProps = useLoaderData<typeof loader>()

  return (
    <Container size={420} py="sm">
      <HoneypotProvider {...honeypotInputProps}>
        <Outlet />
      </HoneypotProvider>
    </Container>
  )
}
