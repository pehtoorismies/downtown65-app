import { DynamoDatetime } from '@downtown65-app/common'
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
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import {
  IconArrowNarrowLeft,
  IconCircleOff,
  IconCircleX,
  IconPencil,
} from '@tabler/icons'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import type { EventLoaderData } from './modules/event-loader-data'
import { EventCardExtended } from '~/components/event-card/event-card-extended'
import {
  ParticipatingContext,
  useParticipationActions,
} from '~/contexts/participating-context'
import type { PublicRoute } from '~/domain/public-route'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import {
  publicLogout,
  getAuthenticatedUser,
  actionAuthenticate,
} from '~/session.server'
import { mapToData } from '~/util/event-type'

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  if (!data) {
    return {
      title: 'Not found',
    }
  }

  const { eventItem, origin } = data
  const typeData = mapToData(eventItem.type)
  return {
    title: eventItem.title,
    'og:type': 'website',
    'og:url': `${origin}${location.pathname}`,
    'og:title': `${eventItem.title}`,
    'og:description': `${eventItem.dateStart} - ${eventItem.subtitle}`,
    'og:image': `${origin}${typeData.imageUrl}`,
    'og:image:type': 'image/jpg',
  }
}

const getOriginForMeta = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  const domainName = process.env['DOMAIN_NAME']
  if (!domainName) {
    throw new Error(`Environment value 'process.env.DOMAIN_NAME' is not set`)
  }
  return `https://${domainName}`
}

interface LoaderData extends PublicRoute {
  eventItem: EventLoaderData
  origin: string // for meta
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')
  // console.log('secret secrererrer', process.env['COOKIE_SECRET'])
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
      statusText: 'Tapahtumaa ei l??ydy',
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
    return json<LoaderData>({
      ...data,
      user,
      eventItem: {
        ...data.eventItem,
        me: user,
      },
    })
  }

  return publicLogout(request, {
    ...data,
    eventItem: {
      ...data.eventItem,
    },
  })
}

export const action: ActionFunction = async ({ request, params }) => {
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
  const { eventItem, user } = useLoaderData<LoaderData>()
  const transition = useTransition()

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

  if (transition.state === 'loading') {
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
      >
        <LoadingOverlay
          visible={transition.state === 'submitting'}
          transitionDuration={200}
        />
        <TypographyStylesProvider my="sm">
          <p>
            Varmista tapahtuman <strong>{eventItem.title}</strong> poisto.
            Kirjoita allaolevaan kentt????n <i>poista</i> ja klikkaa Poista.
          </p>
        </TypographyStylesProvider>
        <Form action={`/events/${eventItem.id}`} method="post">
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
              name="action"
              value="delete"
              type="submit"
              color="red"
              disabled={formValue !== 'poista'}
              rightIcon={<IconCircleOff size={18} />}
            >
              Poista
            </Button>
          </Group>
        </Form>
      </Modal>
      <Container pt={12}>
        <Breadcrumbs mb="xs">{items}</Breadcrumbs>
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
              >
                Muokkaa
              </Button>
              <Button
                color="grape"
                onClick={() => setOpened(true)}
                rightIcon={<IconCircleOff size={18} />}
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
  const caught = useCatch()
  const { imageUrl } = mapToData('ORIENTEERING')

  return (
    <Container py="lg">
      <Title my="sm" align="center" size={40}>
        {caught.status}
      </Title>
      <Image radius="md" src={imageUrl} alt="Random event image" />
      <Text align="center"> {caught.statusText}</Text>
      <Button
        component={Link}
        to="/"
        variant="outline"
        size="md"
        mt="xl"
        leftIcon={<IconArrowNarrowLeft size={18} />}
      >
        Etusivulle
      </Button>
    </Container>
  )
}
