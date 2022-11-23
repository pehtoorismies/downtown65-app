import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import type { User } from '~/domain/user'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import type { EventState } from '~/pages/events/components/event-state'
import { ActiveStep } from '~/pages/events/components/reducer'
import { validateSessionUser } from '~/session.server'

export type LoaderData = {
  me: User
  state: Omit<EventState, 'date' | 'time'>
  dateStart: string
  timeStart?: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')

  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/login')
  }

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
    me: result.user,
    state: {
      ...rest,
      activeStep: ActiveStep.STEP_EVENT_TYPE,
      eventType: type,
      description: description ?? '',
      isRace: race,
      submitEvent: false,
    },

    dateStart,
    timeStart,
  })
}
