import {
  Breadcrumbs,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Anchor,
  Text,
  TextInput,
  TypographyStylesProvider,
} from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import { IconCircleOff, IconCircleX, IconPencil } from '@tabler/icons'
import { GraphQLClient } from 'graphql-request'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import type { EventCardExtendedProps } from '~/components/event-card/event-card-extended'
import { EventCardExtended } from '~/components/event-card/event-card-extended'
import { getSdk } from '~/gql/types.gen'
import { getUser } from '~/session.server'

// const users = [
//   { nick: 'gardan', id: '1' },
//   { nick: 'pehtoorismies1', id: '2' },
//   { nick: 'tanker', id: '3' },
//   { nick: 'koira', id: '4' },
//   { nick: 'Buccis', id: '5' },
//   { nick: 'kissa', id: '6' },
// ]

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - incoming events',
  }
}

type LoaderData = {
  eventItem: Awaited<EventCardExtendedProps>
}

const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment value 'process.env.${name}' is not set`)
  }
  return value
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const client = new GraphQLClient(getEnvironmentVariable('API_URL'))
  invariant(params.id, 'Expected params.id')

  const sdk = getSdk(client)
  const { event } = await sdk.GetEvent(
    {
      eventId: params.id,
    },
    {
      'x-api-key': getEnvironmentVariable('API_KEY'),
    }
  )

  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  const user = await getUser(request)

  return json<LoaderData>({
    eventItem: {
      ...event,
      description: event.description ?? '',
      creator: {
        nickname: 'koira',
        id: '123',
        picture: 'asdasd',
      },
      isRace: event.race,
      me: user,
      participants: [],
    },
  })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const Dt65Event = () => {
  const { eventItem } = useLoaderData<LoaderData>()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)
  const [formValue, setFormValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const items = [
    { title: 'Tapahtumat', href: '/events' },
    { title: eventItem.title, href: `/events/${eventItem.id}` },
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue(event.target.value)
  }

  const onCloseModal = () => {
    setFormValue('')
    setOpened(false)
  }

  const onDeleteEvent = async () => {
    setIsDeleting(true)
    await sleep(3000)
    setIsDeleting(false)
    navigate('/')
  }

  return (
    <>
      <Modal opened={opened} onClose={onCloseModal} title="Tapahtuman poisto">
        <LoadingOverlay visible={isDeleting} transitionDuration={200} />
        <TypographyStylesProvider my="sm">
          <h3>Olet poistamassa tapahtumaa</h3>
          <p>
            Sinun pitää varmistaa tapahtuman{' '}
            <strong>"{eventItem.title}"</strong> poistaminen.
            <br /> Kirjoita allaolevaan kenttään <i>poista</i> ja klikkaa
            Poista.
          </p>
        </TypographyStylesProvider>

        <TextInput
          placeholder="poista"
          label="Kirjoita 'poista'"
          value={formValue}
          onChange={handleChange}
        />

        <Text mt="sm">
          Voit peruuttaa poiston sulkemalla dialogin tai klikkaamalla Peruuta.
        </Text>
        <Group position="apart" mt="lg">
          <Button onClick={onCloseModal} leftIcon={<IconCircleX size={18} />}>
            Peruuta
          </Button>
          <Button
            color="red"
            disabled={formValue !== 'poista'}
            onClick={onDeleteEvent}
            rightIcon={<IconCircleOff size={18} />}
          >
            Poista
          </Button>
        </Group>
      </Modal>
      <Container pt={12}>
        <Breadcrumbs mb="xs">{items}</Breadcrumbs>
        <EventCardExtended {...eventItem} />
        <Text align="center" mt="xl" weight={600} color="dimmed">
          Modification zone
        </Text>
        <Group position="center" my="xl" spacing="xl">
          <Button rightIcon={<IconPencil size={18} />}>Muokkaa</Button>
          <Button
            color="grape"
            onClick={() => setOpened(true)}
            rightIcon={<IconCircleOff size={18} />}
          >
            Poista tapahtuma
          </Button>
        </Group>
      </Container>
    </>
  )
}

export default Dt65Event
