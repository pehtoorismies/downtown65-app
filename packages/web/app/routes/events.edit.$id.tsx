import {
  ISODate,
  ISOTime,
  toDate,
  toTimeComponents,
} from '@downtown65-app/core/time-functions'
import { graphql } from '@downtown65-app/graphql/gql'
import {
  GetEventDocument,
  UpdateEventDocument,
} from '@downtown65-app/graphql/graphql'
import {
  Anchor,
  Breadcrumbs,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Modal,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import { IconCircleOff, IconCircleX } from '@tabler/icons-react'
import React, { useReducer } from 'react'
import invariant from 'tiny-invariant'
import type { Context } from '~/contexts/participating-context'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { EditOrCreate } from '~/routes-common/events/components/edit-or-create'
import { ActiveStep, reducer } from '~/routes-common/events/components/reducer'
import { getEventForm } from '~/routes-common/events/get-event-form'
import { actionAuthenticate, loaderAuthenticate } from '~/session.server'

const _GqlIgnored = graphql(`
  mutation UpdateEvent($eventId: ID!, $input: UpdateEventInput!) {
    updateEvent(eventId: $eventId, input: $input) {
      id
    }
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - edit event',
    },
  ]
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Expected params.id')
  const { user } = await loaderAuthenticate(request)

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
  const { timeStart, dateStart, race, description, type, ...rest } = event

  return json({
    eventId: event.id,
    user,
    initState: {
      kind: 'edit',
      ...rest,
      eventType: type,
      description: description ?? '',
      isRace: race,
      submitEvent: false,
    },
    initDateStart: dateStart,
    initTimeStart: timeStart,
  })
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.id, 'Expected params.id')

  const userSession = await actionAuthenticate(request)

  const { id: eventId } = params

  const body = await request.formData()

  const { description, location, isRace, subtitle, title, type, time, date } =
    getEventForm(body)

  await gqlClient.request(
    UpdateEventDocument,
    {
      eventId,
      input: {
        dateStart: date,
        description,
        location,
        race: isRace,
        subtitle,
        timeStart: time,
        title,
        type,
      },
    },
    {
      Authorization: `Bearer ${userSession.accessToken}`,
    }
  )

  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(messageSession, 'Tapahtuman muokkaus onnistui')

  const headers = userSession.headers
  headers.append('Set-Cookie', await commitMessageSession(messageSession))
  return redirect(`/events/${eventId}`, {
    headers,
  })
}
// TODO: hack to keep typescript happy
const getInitKind = (kind: string): 'edit' | 'create' => {
  if (kind === 'edit') {
    return 'edit'
  }
  if (kind === 'create') {
    return 'create'
  }
  throw new Error('Unsupported initial state')
}

const getISOTime = (time?: string | null) => {
  if (time == null) {
    return
  }
  return ISOTime.parse(time)
}

export default function EditEvent() {
  const {
    user: me,
    initState,
    initTimeStart,
    initDateStart,
    eventId,
  } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const [opened, handlers] = useDisclosure(false)

  const time = getISOTime(initTimeStart)

  const timeComponents = time ? toTimeComponents(time) : {}

  const eventDate = toDate(ISODate.parse(initDateStart))

  const [eventState, dispatch] = useReducer(reducer, {
    ...initState,
    activeStep: ActiveStep.STEP_EVENT_TYPE,
    kind: getInitKind(initState.kind),
    date: eventDate,
    time: timeComponents,
  })

  const participatingActions: Context = {
    onLeave: () => {
      // dispatch({ kind: 'leaveEvent', me })
    },
    onParticipate: () => {
      // dispatch({ kind: 'participateEvent', me })
    },
    state: 'idle',
    loadingId: 'not-defined',
    participationEnabled: false,
  }

  const items = [
    { title: 'Tapahtumat', href: '/events' },
    { title: initState.title, href: `/events/${eventId}` },
    { title: 'edit' },
  ].map((item, index) => {
    return item.href ? (
      <Anchor component={Link} to={item.href} key={index}>
        {item.title}
      </Anchor>
    ) : (
      <Text key={index}>{item.title}</Text>
    )
  })

  return (
    <>
      <Modal
        zIndex={2000}
        opened={opened}
        onClose={() => handlers.close()}
        title="Keskeytä tapahtuman muokkaus"
        closeButtonProps={{ 'aria-label': 'Close' }}
      >
        <Group
          justify="space-between"
          mt={50}
          data-testid="confirmation-modal-content"
        >
          <Button
            onClick={() => handlers.close()}
            leftSection={<IconCircleX size={18} />}
            data-testid="modal-close"
          >
            Sulje
          </Button>
          <Button
            onClick={() => navigate(`/events/${eventId}`)}
            name="action"
            value="delete"
            type="submit"
            color="red"
            rightSection={<IconCircleOff size={18} />}
            data-testid="modal-cancel-event-creation"
          >
            Keskeytä
          </Button>
        </Group>
      </Modal>
      <Container>
        <Breadcrumbs py="xs">{items}</Breadcrumbs>
        <Title order={1} size="h3" my="sm">
          Muokkaat tapahtumaa "{initState.title}"
        </Title>
      </Container>
      <EditOrCreate
        cancelRedirectPath={`/events/${eventId}`}
        state={eventState}
        me={me}
        dispatch={dispatch}
        participatingActions={participatingActions}
      />
      <Divider my="sm" />
      <Center>
        <Button
          my="md"
          color="red"
          rightSection={<IconCircleOff size={18} />}
          onClick={handlers.open}
        >
          Keskeytä muokkaus
        </Button>
      </Center>
    </>
  )
}
