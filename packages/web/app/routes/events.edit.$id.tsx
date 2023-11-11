import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
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
  Text,
} from '@mantine/core'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { IconRocket } from '@tabler/icons-react'
import { useReducer } from 'react'
import invariant from 'tiny-invariant'
import type { Context } from '~/contexts/participating-context'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { EditOrCreate } from '~/routes-common/events/components/edit-or-create'
import { isValidStateToSave } from '~/routes-common/events/components/event-state'
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

// interface LoaderData extends PrivateRoute {
//   initState: Omit<EventState, 'date' | 'time'>
//   initDateStart: string
//   initTimeStart?: string
//   eventId: string
// }

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
      activeStep: ActiveStep.STEP_EVENT_TYPE,
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
        description: description.trim() === '' ? undefined : description,
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

export default function EditEvent() {
  const {
    user: me,
    initState,
    initTimeStart,
    initDateStart,
    eventId,
  } = useLoaderData<typeof loader>()
  const ddt = DynamoDatetime.fromISO(initDateStart, initTimeStart ?? undefined)

  const [eventState, dispatch] = useReducer(reducer, {
    ...initState,
    // TODO: smell
    kind: getInitKind(initState.kind),
    date: ddt.getDateObject(),
    time: ddt.getTimeComponents() ?? {
      hours: undefined,
      minutes: undefined,
    },
  })

  const participatingActions: Context = {
    onLeave: () => {
      dispatch({ kind: 'leaveEvent', me })
    },
    onParticipate: () => {
      dispatch({ kind: 'participateEvent', me })
    },
    state: 'idle',
    loadingEventId: 'not-defined',
  }

  const items = [
    { title: 'Tapahtumat', href: '/events' },
    { title: eventState.title, href: `/events/${eventId}` },
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
      <Container>
        <Breadcrumbs py="xs">{items}</Breadcrumbs>
      </Container>
      <EditOrCreate
        cancelRedirectPath={`/events/${eventId}`}
        state={eventState}
        me={me}
        dispatch={dispatch}
        participatingActions={participatingActions}
      />
      {eventState.activeStep !== ActiveStep.STEP_PREVIEW && (
        <Center>
          <Button
            onClick={() => dispatch({ kind: 'toPreview' })}
            disabled={!isValidStateToSave(eventState)}
            mt="xs"
            rightSection={<IconRocket size={18} />}
            // TODO: fix below
            // styles={() => ({
            //   leftIcon: {
            //     marginRight: 15,
            //   },
            // })}
          >
            Näytä esikatselu
          </Button>
        </Center>
      )}
      <Divider mt="md" m="sm" />
      <Text ta="center" fz="md" fw={400} c="dtPink.4" mt="xs">
        Muokkaat tapahtumaa:
      </Text>
      <Text ta="center" fz="md" fw={700} c="dtPink.4">
        {`${initState.title}`}
      </Text>
    </>
  )
}
