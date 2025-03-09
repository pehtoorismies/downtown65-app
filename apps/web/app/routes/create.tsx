import {
  Button,
  Card,
  Center,
  Container,
  Image,
  SimpleGrid,
  Title,
} from '@mantine/core'
import { json } from '@remix-run/node'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import React from 'react'
import { loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - new challenge',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await loaderAuthenticate(request)

  return json({
    user,
  })
}

export default function Create() {
  return (
    <Container>
      <Center>
        <Title my="md">Valitse tyyppi</Title>
      </Center>
      <SimpleGrid cols={{ base: 1, sm: 2 }} />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          component={Link}
          to="/events/new"
        >
          <Card.Section>
            <Image src="/images/suo.jpg" height={160} alt="Event" />
          </Card.Section>
          <Button color="blue" fullWidth mt="md" radius="md">
            Luo Tapahtuma
          </Button>
        </Card>

        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          component={Link}
          to="/challenges/new"
        >
          <Card.Section>
            <Image src="/images/abs.jpg" height={160} alt="Challenge" />
          </Card.Section>
          <Button color="yellow" fullWidth mt="md" radius="md">
            Luo Kuukausi-haaste
          </Button>
        </Card>
      </SimpleGrid>
    </Container>
  )
}
