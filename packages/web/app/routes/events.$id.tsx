import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import { EventType } from '@downtown65-app/graphql/appsync.gen'
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
import { EventCardExtended } from '~/components/event-card/event-card-extended'
import { Config } from '~/config/config'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
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
      'og:type': 'website',
      'og:url': `${origin}${location.pathname}`,
      'og:title': `${eventItem.title}`,
      'og:description': `${eventItem.dateStart} - ${eventItem.subtitle}`,
      'og:image': `${origin}${typeData.imageUrl}`,
      'og:image:type': 'image/jpg',
    },
  ]
}

const getOriginForMeta = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  return `https://${Config.DOMAIN_NAME}`
}

// interface LoaderData extends PublicRoute {
//   eventItem: EventLoaderData
//   origin: string // for meta
// }

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Expected params.id')
  const user = await getAuthenticatedUser(request)

  const { event } = await getGqlSdk().GetEvent(
    {
      eventId: params.id,
    },
    getPublicAuthHeaders()
  )

  if (!event) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Tapahtumaa ei löydy',
    })
  }

  const ddt = new DynamoDatetime({
    date: event.dateStart,
    time: event.timeStart,
  })

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
      await getGqlSdk().DeleteEvent(
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
      await getGqlSdk().ParticipateEvent(
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
      await getGqlSdk().LeaveEvent(
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

  const participationActions = useParticipationActions()
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
          transitionDuration={200}
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
          <Group position="apart" mt="lg">
            <Button
              onClick={onCloseModal}
              leftIcon={<IconCircleX size={18} />}
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
              rightIcon={<IconCircleOff size={18} />}
              data-testid="confirm-delete"
            >
              Poista
            </Button>
          </Group>
        </Form>
      </Modal>
      <Container fluid pt={12}>
        <Breadcrumbs mb="xs">{items}</Breadcrumbs>
      </Container>
      <Container>
        <ParticipatingContext.Provider value={participationActions}>
          <EventCardExtended {...eventItem} />
        </ParticipatingContext.Provider>
        {user && (
          <>
            <Text align="center" mt="xl" weight={600} color="dimmed">
              Modification zone
            </Text>
            <Group position="center" my="xl" spacing="xl">
              <Button
                component={Link}
                to={`/events/edit/${eventItem.id}`}
                rightIcon={<IconPencil size={18} />}
                data-testid="modify-event-btn"
              >
                Muokkaa
              </Button>
              <Button
                color="grape"
                onClick={() => setOpened(true)}
                rightIcon={<IconCircleOff size={18} />}
                data-testid="delete-event-btn"
              >
                Poista tapahtuma
              </Button>
            </Group>
          </>
        )}
      </Container>
    </>
  )
}

export const CatchBoundary = () => {
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
      <Title my="sm" align="center" size={40}>
        {error.status}
      </Title>
      <Image radius="md" src={imageUrl} alt="Random event image" />
      <Text align="center"> {error.statusText}</Text>
      <Button
        component={Link}
        to="/"
        variant="outline"
        size="md"
        mt="xl"
        leftIcon={<IconArrowNarrowLeft size={18} />}
        data-testid="to-frontpage-button"
      >
        Etusivulle
      </Button>
    </Container>
  )
}
