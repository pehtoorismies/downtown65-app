import { graphql } from '@downtown65-app/graphql/gql'
import { CreateEventDocument } from '@downtown65-app/graphql/graphql'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useReducer } from 'react'
import type { Context } from '~/contexts/participating-context'
import { gqlClient } from '~/gql/get-gql-client.server'
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
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - new event',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await loaderAuthenticate(request)

  return json({
    user,
  })
}

export const action = async ({ request }: ActionFunctionArgs) => {
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

  const { createEvent } = await gqlClient.request(
    CreateEventDocument,
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
  const { user: me } = useLoaderData<typeof loader>()
  const [eventState, dispatch] = useReducer(reducer, {
    activeStep: ActiveStep.STEP_EVENT_TYPE,
    date: new Date(),
    description: '',
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
    loadingId: 'not-defined',
  }

  return (
    <>
      <EditOrCreate
        cancelRedirectPath="/events"
        state={eventState}
        me={me}
        dispatch={dispatch}
        participatingActions={participatingActions}
      />
    </>
  )
}
