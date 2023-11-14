import {
  Breadcrumbs,
  Button,
  Center,
  Container,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconTargetArrow } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import React from 'react'
import { loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - incoming challenges',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await loaderAuthenticate(request)

  return json({
    user,
    challenges: [],
  })
}

const ChallengesBreadcrumb = () => {
  return (
    <Container fluid>
      <Breadcrumbs mb="xs">
        <Text data-testid="breadcrumbs-current">Haasteet</Text>
      </Breadcrumbs>
    </Container>
  )
}

const Root = ({ children }: { children: ReactNode }) => (
  <>
    <ChallengesBreadcrumb />
    <Container data-testid="events" p="xs" size="1000">
      {children}
    </Container>
  </>
)

export default function GetEvents() {
  const { challenges } = useLoaderData<typeof loader>()

  if (challenges.length === 0) {
    return (
      <Root>
        <Title order={1} ta="center">
          Ei tulevia haasteita
        </Title>
        <Center>
          <Button
            component={Link}
            to="/challenges/new"
            color="yellow"
            size="lg"
            mt="xs"
            rightSection={<IconTargetArrow size={30} />}
          >
            Luo uusi haaste
          </Button>
        </Center>
      </Root>
    )
  }
}
