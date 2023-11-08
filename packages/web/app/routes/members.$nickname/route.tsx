import { graphql } from '@downtown65-app/graphql/gql'
import { GetUserByNickDocument } from '@downtown65-app/graphql/graphql'
import {
  Anchor,
  Breadcrumbs,
  Button,
  Center,
  Container,
  Divider,
  Image,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import { format } from 'date-fns'
import React from 'react'
import invariant from 'tiny-invariant'
import notFoundProfileImage from './not-found.jpg'
import { ProfileBox } from '~/components/profile-box'
import { gqlClient } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'

const _GqlIgnored = graphql(`
  query GetUserByNick($nickname: String!) {
    user(nickname: $nickname) {
      id
      name
      nickname
      email
      picture
      createdAt
    }
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - profiili',
    },
  ]
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.nickname, 'Expected params.nickname')
  const { user, accessToken } = await loaderAuthenticate(request)

  const response = await gqlClient.request(
    GetUserByNickDocument,
    {
      nickname: params.nickname,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )

  if (!response.user) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Käyttäjää ei löydy',
    })
  }

  const createdAt = format(new Date(response.user.createdAt), 'd.M.yyyy')

  return json({
    user,
    ...response.user,
    createdAt,
  })
}

export default function MemberPage() {
  const data = useLoaderData<typeof loader>()
  const createdAt = `käyttäjä luotu: ${data.createdAt}`
  return (
    <>
      <Container fluid mt={75}>
        <Breadcrumbs mb="xs">
          <Anchor
            component={Link}
            to="/members"
            data-testid="breadcrumbs-parent"
          >
            Jäsenet
          </Anchor>
          <Text data-testid="breadcrumbs-current">{data.nickname}</Text>
        </Breadcrumbs>
      </Container>
      <Container size="xs">
        <Title ta="center" order={1} mt="sm">
          Jäsenprofiili
        </Title>
        <ProfileBox {...data} />
        <Divider my="sm" label="System stats" labelPosition="center" />
        <Text
          ta="center"
          fz="sm"
          fw={500}
          fs="italic"
          data-testid="member-created-at"
        >
          {createdAt}
        </Text>

        <Center mt="xl">
          <Anchor component={Link} to="/members" data-testid="to-members-link">
            Jäsenet-sivulle &#187;
          </Anchor>
        </Center>
      </Container>
    </>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()

  if (!isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Uh oh ...</h1>
        <p>Something went wrong.</p>
      </div>
    )
  }

  return (
    <Container py="lg">
      <Title my="sm" ta="center" size={40}>
        {error.status}
      </Title>
      <Image
        radius="md"
        src={notFoundProfileImage}
        alt="Anonymous holding fire"
      />
      <Text ta="center"> {error.statusText}</Text>
      <Button
        component={Link}
        to="/members"
        variant="outline"
        size="md"
        mt="xl"
        leftSection={<IconArrowNarrowLeft size={18} />}
        data-testid="to-members-button"
      >
        Jäsensivulle
      </Button>
    </Container>
  )
}
