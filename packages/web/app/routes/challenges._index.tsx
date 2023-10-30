import { Container } from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Voucher } from '~/components/voucher/voucher'
import { loaderAuthenticate } from '~/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await loaderAuthenticate(request)

  return json({
    user,
  })
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - challenges',
    },
  ]
}

export default function GetChallenges() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <Container data-testid="challenges" p="xs" size="1000">
      <Voucher>
        <Voucher.Header bgImageUrl={'/event-images/nordicwalking.jpg'}>
          <Voucher.Header.Title>Joku event nimi</Voucher.Header.Title>
          <Voucher.Header.ParticipantCount participants={[]} user={user} />
          <Voucher.Header.Creator nick="koira" />
          <Voucher.Header.Competition />
        </Voucher.Header>
      </Voucher>
    </Container>
  )
}
