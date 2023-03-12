import {
  Anchor,
  Button,
  Center,
  Container,
  Divider,
  Image,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import format from 'date-fns/format'
import React from 'react'
import invariant from 'tiny-invariant'
import { ProfileBox } from '~/components/profile-box'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import notFoundProfileImage from '~/images/not-found.jpg'
import { loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - profiili',
  }
}

interface LoaderData extends PrivateRoute {
  name: string
  nickname: string
  email: string
  picture: string
  createdAt: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.nickname, 'Expected params.nickname')
  const { user, accessToken } = await loaderAuthenticate(request)

  const response = await getGqlSdk().GetUserByNick(
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

  return {
    user,
    ...response.user,
    createdAt,
  }
}

export default function MemberPage() {
  const data = useLoaderData<LoaderData>()
  const createdAt = `käyttäjä luotu: ${data.createdAt}`
  return (
    <Container size="xs" mt={75}>
      <Title ta="center" order={1}>
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
  )
}

export const CatchBoundary = () => {
  const caught = useCatch()

  return (
    <Container py="lg">
      <Title my="sm" align="center" size={40}>
        {caught.status}
      </Title>
      <Image
        radius="md"
        src={notFoundProfileImage}
        alt="Anonymous holding fire"
      />
      <Text align="center"> {caught.statusText}</Text>
      <Button
        component={Link}
        to="/members"
        variant="outline"
        size="md"
        mt="xl"
        leftIcon={<IconArrowNarrowLeft size={18} />}
        data-testid="to-members-button"
      >
        Jäsensivulle
      </Button>
    </Container>
  )
}
