import { Container, Title } from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { ProfileBox } from '~/routes/profile/modules/profile-box'
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
      statusText: 'KÄyttäjää ei löydy',
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
    </Container>
  )
}
