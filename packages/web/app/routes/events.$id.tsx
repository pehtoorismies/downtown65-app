import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import { graphql } from '@downtown65-app/graphql/gql'
import {
  DeleteEventDocument,
  EventType,
  GetEventDocument,
  LeaveEventDocument,
  ParticipateEventDocument,
} from '@downtown65-app/graphql/graphql'
import {
  Anchor,
  Breadcrumbs,
  Button,
  Center,
  Container,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  Title,
  TypographyStylesProvider,
} from '@mantine/core'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react'
import {
  IconArrowNarrowLeft,
  IconCircleOff,
  IconCircleX,
  IconPencil,
} from '@tabler/icons-react'
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import invariant from 'tiny-invariant'
import { EventCard } from '~/components/event/event-card'
import { Config } from '~/config/config'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import {
  actionAuthenticate,
  getAuthenticatedUser,
  getSession,
} from '~/session.server'
import { mapToData } from '~/util/event-type'

const _GqlIgnored = graphql(`
  query GetEvent($eventId: ID!) {
    event(eventId: $eventId) {
      id
      createdBy {
        id
        nickname
        picture
      }
      dateStart
      description
      location
      participants {
        id
        joinedAt
        nickname
        picture
      }
      race
      subtitle
      title
      timeStart
      type
    }
  }
  mutation ParticipateEvent($eventId: ID!, $me: MeInput!) {
    participateEvent(eventId: $eventId, me: $me)
  }
  mutation LeaveEvent($eventId: ID!) {
    leaveEvent(eventId: $eventId)
  }
  mutation DeleteEvent($eventId: ID!) {
    deleteEvent(eventId: $eventId) {
      id
    }
  }
`)

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  if (!data) {
    return [
      {
        title: 'Not found',
      },
    ]
  }

  const { eventItem, origin } = data
  const typeData = mapToData(eventItem.type)
  return [
    {
      title: eventItem.title,
    },
    {
      property: 'og:type',
      content: 'website',
    },

    {
      property: 'og:url',
      content: `${origin}${location.pathname}`,
    },
    {
      property: 'og:title',
      content: `${eventItem.title}`,
    },
    {
      property: 'og:description',
      content: `${eventItem.dateStart} - ${eventItem.subtitle}`,
    },
    {
      property: 'og:image',
      content: `${origin}${typeData.imageUrl}`,
    },
    {
      property: 'og:image:type',
      content: 'image/jpg',
    },
  ]
}

const getOriginForMeta = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  return `https://${Config.DOMAIN_NAME}`
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Expected params.id')
  const user = await getAuthenticatedUser(request)

  const { event } = await gqlClient.request(
    GetEventDocument,
    {
      eventId: params.id,
    },
    PUBLIC_AUTH_HEADERS
  )

  if (!event) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Tapahtumaa ei löydy',
    })
  }

  const ddt = DynamoDatetime.fromISO(
    event.dateStart,
    event.timeStart ?? undefined
  )

  const data = {
    eventItem: {
      ...event,
      dateStart: ddt.getFormattedDate(),
      description: event.description ?? '',
      isRace: event.race,
    },
    origin: getOriginForMeta(),
  }

  if (user) {
    return json({
      ...data,
      user,
      eventItem: {
        ...data.eventItem,
        me: user,
      },
    })
  }

  await getSession(request)
  return json({
    ...data,
    user: null,
    eventItem: {
      ...data.eventItem,
    },
  })
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.id, 'Expected params.id')
  const { headers, user, accessToken } = await actionAuthenticate(request)
  const body = await request.formData()
  const action = body.get('action')

  switch (action) {
    case 'delete': {
      // TODO: add error handling
      await gqlClient.request(
        DeleteEventDocument,
        {
          eventId: params.id,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      )
      const session = await getMessageSession(request.headers.get('cookie'))
      setSuccessMessage(session, 'Tapahtuma on poistettu')

      headers.append('Set-Cookie', await commitMessageSession(session))

      return redirect('/events', {
        headers,
      })
    }
    case 'participate': {
      await gqlClient.request(
        ParticipateEventDocument,
        {
          eventId: params.id,
          me: user,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      )
      return json({}, { headers })
    }
    case 'leave': {
      await gqlClient.request(
        LeaveEventDocument,
        {
          eventId: params.id,
        },
        {
          Authorization: `Bearer ${accessToken}`,
        }
      )
      return json({}, { headers })
    }
  }

  throw new Error(
    `Incorrect action provided: '${action}'. Use 'leave' or 'participate'`
  )
}

export default function GetEvent() {
  const { eventItem, user } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  const participationActions = useParticipationActions('event')
  const [opened, setOpened] = useState(false)
  const [formValue, setFormValue] = useState('')

  const items = [
    { title: 'Tapahtumat', href: '/events' },
    { title: eventItem.title },
  ].map((item, index) => {
    return item.href ? (
      <Anchor component={Link} to={item.href} key={index}>
        {item.title}
      </Anchor>
    ) : (
      <Text key={index}>{item.title}</Text>
    )
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue(event.target.value)
  }

  const onCloseModal = () => {
    setFormValue('')
    setOpened(false)
  }

  if (navigation.state === 'loading') {
    return (
      <Center py={100}>
        <Loader />
      </Center>
    )
  }

  if (!user) {
    return (
      <>
        <Container p={{ base: 1, sm: 'xs' }}>
          <Breadcrumbs mb="xs">{items}</Breadcrumbs>
          <ParticipatingContext.Provider
            value={{
              onLeave: () => {},
              onParticipate: () => {},
              state: 'idle',
              loadingId: undefined,
            }}
          >
            <EventCard eventId={eventItem.id} {...eventItem} />
          </ParticipatingContext.Provider>
        </Container>
      </>
    )
  }

  return (
    <>
      <Modal
        zIndex={2000}
        opened={opened}
        onClose={onCloseModal}
        title="Tapahtuman poisto"
        closeButtonProps={{ 'aria-label': 'Close' }}
      >
        <LoadingOverlay
          visible={navigation.state === 'submitting'}
          // TODO: below
          //transitionDuration={200}
        />
        <TypographyStylesProvider
          my="sm"
          data-testid="delete-confirmation-modal-content"
        >
          <p>
            Varmista tapahtuman <strong>{eventItem.title}</strong> poisto.
            Kirjoita allaolevaan kenttään <i>poista</i> ja klikkaa Poista.
          </p>
        </TypographyStylesProvider>
        <Form action={`/events/${eventItem.id}`} method="post">
          <TextInput
            name="delete-confirm"
            placeholder="poista"
            label="Kirjoita 'poista'"
            value={formValue}
            onChange={handleChange}
          />
          <Text mt="sm">
            Voit peruuttaa poiston sulkemalla dialogin tai klikkaamalla Peruuta.
          </Text>
          <Group justify="space-between" mt="lg">
            <Button
              onClick={onCloseModal}
              leftSection={<IconCircleX size={18} />}
              data-testid="modal-close"
            >
              Peruuta
            </Button>
            <Button
              name="action"
              value="delete"
              type="submit"
              color="red"
              disabled={formValue !== 'poista'}
              rightSection={<IconCircleOff size={18} />}
              data-testid="confirm-delete"
            >
              Poista
            </Button>
          </Group>
        </Form>
      </Modal>
      <Container p={{ base: 1, sm: 'xs' }}>
        <Breadcrumbs mb="xs">{items}</Breadcrumbs>
        <ParticipatingContext.Provider value={participationActions}>
          <EventCard eventId={eventItem.id} {...eventItem} />
        </ParticipatingContext.Provider>
        <Text ta="center" mt="xl" fw={600} c="dimmed">
          Modification zone
        </Text>
        <Group justify="center" my="xl" gap="xl">
          <Button
            component={Link}
            to={`/events/edit/${eventItem.id}`}
            rightSection={<IconPencil size={18} />}
            data-testid="modify-event-btn"
          >
            Muokkaa
          </Button>
          <Button
            color="grape"
            onClick={() => setOpened(true)}
            rightSection={<IconCircleOff size={18} />}
            data-testid="delete-event-btn"
          >
            Poista tapahtuma
          </Button>
        </Group>
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

  const { imageUrl } = mapToData(EventType.Orienteering)

  return (
    <Container py="lg">
      <Title my="sm" ta="center" size={40}>
        {error.status}
      </Title>
      <Image radius="md" src={imageUrl} alt="Random event image" />
      <Text ta="center"> {error.statusText}</Text>
      <Button
        component={Link}
        to="/"
        variant="outline"
        size="md"
        mt="xl"
        leftSection={<IconArrowNarrowLeft size={18} />}
        data-testid="to-frontpage-button"
      >
        Etusivulle
      </Button>
    </Container>
  )
}
