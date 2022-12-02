import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import type { User } from '~/domain/user'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import type { EventState } from '~/pages/events/components/event-state'
import { ActiveStep } from '~/pages/events/components/reducer'
import { logout, validateSessionUser } from '~/session.server'

export type LoaderData = {
  me: User
  initState: Omit<EventState, 'date' | 'time'>
  initDateStart: string
  initTimeStart?: string
  eventId: string
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')
  const userSession = await validateSessionUser(request)

  if (!userSession.valid) {
    return logout(request)
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

  return json<LoaderData>(
    {
      eventId: event.id,
      me: userSession.user,
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
    },
    { headers: userSession.headers }
  )
}
