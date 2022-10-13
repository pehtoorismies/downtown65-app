import { Container } from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import type { EventCardProperties } from '~/components/event-card'
import { EventCard } from '~/components/event-card'
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

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, 'Expected params.id')

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

const Dt65Event = () => {
  const { eventItem } = useLoaderData<LoaderData>()

  return (
    <Container pt={12}>
      <EventCard {...eventItem} />
    </Container>
  )
}

export default Dt65Event
