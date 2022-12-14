import { DynamoDatetime } from '@downtown65-app/common'
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
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { IconRocket } from '@tabler/icons'
import { useEffect, useReducer } from 'react'
import invariant from 'tiny-invariant'
import { EditOrCreate } from '../modules/components/edit-or-create'
import type { EventState } from '../modules/components/event-state'
import { isValidStateToSave } from '../modules/components/event-state'
import { ActiveStep, reducer } from '../modules/components/reducer'
import { eventStateToSubmittable } from '../modules/event-state-to-submittable'
import { getEventForm } from '../modules/get-event-form'
import type { Context } from '~/contexts/participating-context'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { actionAuthenticate, loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - edit event',
  }
}

interface LoaderData extends PrivateRoute {
  initState: Omit<EventState, 'date' | 'time'>
  initDateStart: string
  initTimeStart?: string
  eventId: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')
  const { user } = await loaderAuthenticate(request)

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
  const { timeStart, dateStart, race, description, type, ...rest } = event

  return json<LoaderData>({
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

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')

  const userSession = await actionAuthenticate(request)

  const { id: eventId } = params

  const body = await request.formData()

  const { description, location, isRace, subtitle, title, type, time, date } =
    getEventForm(body)

  await getGqlSdk().UpdateEvent(
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

export default function EditEvent() {
  const fetcher = useFetcher()
  const {
    user: me,
    initState,
    initTimeStart,
    initDateStart,
    eventId,
  } = useLoaderData<LoaderData>()
  const ddt = new DynamoDatetime({
    time: initTimeStart,
    date: initDateStart,
  })

  const [eventState, dispatch] = useReducer(reducer, {
    ...initState,
    date: ddt.getDateObject(),
    time: ddt.getTimes() ?? {
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

  useEffect(() => {
    if (eventState.submitEvent) {
      fetcher.submit(eventStateToSubmittable(eventState), {
        method: 'post',
        action: `/events/edit/${eventId}`,
      })
      dispatch({ kind: 'formSubmitted' })
    }
  }, [fetcher, eventState, eventId])

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
            rightIcon={<IconRocket size={18} />}
            styles={() => ({
              leftIcon: {
                marginRight: 15,
              },
            })}
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
