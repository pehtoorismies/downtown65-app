import { Divider, Text } from '@mantine/core'
import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect, useReducer } from 'react'
import { EditOrCreate } from './modules/components/edit-or-create'
import { ActiveStep, reducer } from './modules/components/reducer'
import { eventStateToSubmittable } from './modules/event-state-to-submittable'
import { getEventForm } from './modules/get-event-form'
import type { Context } from '~/contexts/participating-context'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { loaderAuthenticate, actionAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - new event',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const { user } = await loaderAuthenticate(request)

  return json<PrivateRoute>({
    user,
  })
}

export const action: ActionFunction = async ({ request }) => {
  const { headers, user, accessToken } = await actionAuthenticate(request)

  const body = await request.formData()

  const {
    description,
    location,
    isRace,
    subtitle,
    title,
    type,
    time,
    date,
    participants,
  } = getEventForm(body)

  const { createEvent } = await getGqlSdk().CreateEvent(
    {
      input: {
        createdBy: user,
        dateStart: date,
        description: description.trim() === '' ? undefined : description,
        location,
        race: isRace,
        subtitle,
        timeStart: time,
        title,
        type,
        participants,
      },
    },
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )

  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(messageSession, 'Tapahtuman luonti onnistui')

  headers.append('Set-Cookie', await commitMessageSession(messageSession))

  return redirect(`/events/${createEvent.id}`, {
    headers,
  })
}

export default function NewEvent() {
  const fetcher = useFetcher()
  const { user: me } = useLoaderData<PrivateRoute>()
  const [eventState, dispatch] = useReducer(reducer, {
    activeStep: ActiveStep.STEP_EVENT_TYPE,
    date: new Date(),
    description: 'asdadsjdasladskj adlkjadsladksj adlskj',
    isRace: false,
    location: '',
    participants: [],
    submitEvent: false,
    subtitle: '',
    time: {},
    title: '',
    kind: 'create',
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

  useEffect(() => {
    if (eventState.submitEvent) {
      fetcher.submit(eventStateToSubmittable(eventState), {
        method: 'post',
      })
      dispatch({ kind: 'formSubmitted' })
    }
  }, [fetcher, eventState])

  return (
    <>
      <EditOrCreate
        cancelRedirectPath="/events"
        state={eventState}
        me={me}
        dispatch={dispatch}
        participatingActions={participatingActions}
      />
      <Divider mt="md" m="sm" />
      <Text ta="center" fz="md" fw={400} mt="xs" c="blue">
        Olet luomassa uutta tapahtumaa
      </Text>
    </>
  )
}
