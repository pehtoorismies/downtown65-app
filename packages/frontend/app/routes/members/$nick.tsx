import {
  Anchor,
  Button,
  Center,
  Container,
  Image,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import invariant from 'tiny-invariant'
import { ProfileBox } from '~/components/profile-box'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
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
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.nick, 'Expected params.nick')
  const { user, accessToken } = await loaderAuthenticate(request)

  const response = await getGqlSdk().GetUserByNick(
    {
      nickname: params.nick,
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

  return {
    user,
    ...response.user,
  }
}

export default function ProfilePage() {
  const data = useLoaderData<LoaderData>()
  return (
    <Container size="xs" mt={75}>
      <Title ta="center" order={1}>
        Jäsenprofiili
      </Title>
      <ProfileBox {...data} />
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
        src="/profile/not-found.jpg"
        alt="Random event image"
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
