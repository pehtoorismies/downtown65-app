import { Container, Title } from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { PrivateRoute } from '~/domain/private-route'
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

export const loader: LoaderFunction = async ({ request }) => {
  const { user, accessToken } = await loaderAuthenticate(request)

  return {
    name: 'Kissa Mies',
    nickname: 'kissamies86',
    email: 'asdas@fdssfd.fi',
    picture: 'https://via.placeholder.com/150 ',
    user,
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
