import {
  BackgroundImage,
  Button,
  Card,
  Center,
  Container,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { json } from '@remix-run/node'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import React from 'react'
import classes from '../routes-common/styles/create.module.css'
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
        <Title my="md">Luo uusi</Title>
      </Center>
      <SimpleGrid cols={{ base: 1, sm: 2 }}></SimpleGrid>

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
            <BackgroundImage src="/event-images/skiing.jpg">
              <Stack className={classes.box} align="center" justify="center">
                <Title order={2} className={classes.title}>
                  Haaste
                </Title>
              </Stack>
            </BackgroundImage>
          </Card.Section>
          <Text>Luo uusi tapahtuma</Text>
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
            <Image src="/images/create-new.jpg" height={160} alt="Challenge" />
          </Card.Section>
          <Button color="yellow" fullWidth mt="md" radius="md">
            Kuukausi-haaste
          </Button>
        </Card>
      </SimpleGrid>
    </Container>
  )
}
