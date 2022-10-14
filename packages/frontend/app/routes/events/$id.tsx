import {
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  TypographyStylesProvider,
} from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import {
  IconArrowNarrowLeft,
  IconCircleOff,
  IconCircleX,
  IconPencil,
} from '@tabler/icons'
import { GraphQLClient } from 'graphql-request'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import type { EventCardProperties } from '~/components/event-card'
import { EventCard } from '~/components/event-card'
import { getSdk } from '~/gql/types.gen'
import { mapToData } from '~/util/event-type'

const gardan = { nick: 'gardan', id: '1234' }
const pehtoorismies = { nick: 'pehtoorismies', id: '123' }

const eventItems = [
  {
    id: '1',
    title: 'Kissa',
    type: mapToData('SPINNING'),
    me: pehtoorismies,
    participants: [gardan],
    description:
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam quam dolor, mattis vel faucibus molestie, semper eget sem. Donec mauris tellus, faucibus non purus quis, dictum finibus mauris. Donec ex dui, cursus ut vehicula a, laoreet suscipit enim. Vivamus gravida non mauris interdum finibus. Nullam eget risus eu augue semper tristique id nec magna. Nulla facilisi. Duis at risus ut velit mattis rhoncus. Proin congue odio et dapibus lacinia.',
  },
  {
    id: '2',
    title: 'Kissa',
    type: mapToData('KARONKKA'),
    me: pehtoorismies,
    participants: [pehtoorismies, gardan],
    description:
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam quam dolor, mattis vel faucibus molestie, semper eget sem. Donec mauris tellus, faucibus non purus quis, dictum finibus mauris. Donec ex dui, cursus ut vehicula a, laoreet suscipit enim. Vivamus gravida non mauris interdum finibus. Nullam eget risus eu augue semper tristique id nec magna. Nulla facilisi. Duis at risus ut velit mattis rhoncus. Proin congue odio et dapibus lacinia.',
  },
  {
    id: '3',
    title: 'Kissa',
    type: mapToData('OTHER'),
    me: pehtoorismies,
    participants: [pehtoorismies, gardan],
    description: 'Pellentesque habitant morbi tristique senectus .',
  },
]

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 incoming events',
  }
}

type LoaderData = {
  eventItem: Awaited<EventCardProperties>
}

const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment value 'process.env.${name}' is not set`)
  }
  return value
}

const client = new GraphQLClient(getEnvironmentVariable('API_URL'))

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, 'Expected params.id')
  console.log('api', getEnvironmentVariable('API_KEY'))
  const sdk = getSdk(client)
  const { event } = await sdk.GetEvent(
    {
      eventId: '01GF5HQPY5H65DH9RVTSAKF7N9',
    },
    {
      'x-api-key': getEnvironmentVariable('API_KEY'),
    }
  )
  console.log(event)

  const eventItem = eventItems.find((event) => {
    return event.id === params.id
  })

  if (!eventItem) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({
    eventItem,
  })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const Dt65Event = () => {
  const { eventItem } = useLoaderData<LoaderData>()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)
  const [formValue, setFormValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

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
    console.log('Start delete event', eventItem.id)
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
          <Button
            onClick={onCloseModal}
            leftIcon={<IconCircleX size={18} />}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.gray[6],
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                '&:hover': {
                  backgroundColor: theme.fn.darken(theme.colors.gray[6], 0.05),
                },
              },

              leftIcon: {
                marginRight: 5,
              },
            })}
          >
            Peruuta
          </Button>
          <Button
            disabled={formValue !== 'poista'}
            onClick={onDeleteEvent}
            rightIcon={<IconCircleOff size={18} />}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.red[7],
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                '&:hover': {
                  backgroundColor: theme.fn.darken(theme.colors.red[7], 0.05),
                },
              },

              leftIcon: {
                marginRight: 15,
              },
            })}
          >
            Poista
          </Button>
        </Group>
      </Modal>
      <Container pt={12}>
        <EventCard {...eventItem} isExtended />
        <Group position="center" my="xl" spacing="xl">
          <Button
            rightIcon={<IconPencil size={18} />}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.gray[6],
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                '&:hover': {
                  backgroundColor: theme.fn.darken(theme.colors.gray[6], 0.05),
                },
              },

              leftIcon: {
                marginRight: 15,
              },
            })}
          >
            Muokkaa
          </Button>
          <Button
            onClick={() => setOpened(true)}
            rightIcon={<IconCircleOff size={18} />}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.red[7],
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                '&:hover': {
                  backgroundColor: theme.fn.darken(theme.colors.red[7], 0.05),
                },
              },

              leftIcon: {
                marginRight: 15,
              },
            })}
          >
            Poista
          </Button>
        </Group>
        <Center style={{ width: '100%' }}>
          <Button
            fullWidth
            mt="xs"
            variant="outline"
            leftIcon={<IconArrowNarrowLeft size={18} />}
            styles={() => ({
              leftIcon: {
                marginRight: 15,
              },
            })}
            onClick={() => navigate(`/`)}
          >
            Näytä kaikki tapahtumat
          </Button>
        </Center>
      </Container>
    </>
  )
}

export default Dt65Event
