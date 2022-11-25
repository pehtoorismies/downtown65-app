import { DynamoDatetime } from '@downtown65-app/common'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import type { EventLoaderData } from '~/pages/events/event-loader-data'
import { validateSessionUser } from '~/session.server'

export type LoaderData = {
  eventItem: EventLoaderData
  origin: string
}

const getOrigin = (host: string): string => {
  if (process.env.NODE_ENV === 'development') {
    return `http://${host}`
  }
  return `https://${host}`
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const host = request.headers.get('host')
  invariant(host, 'No host provided in request headers')

  invariant(params.id, 'Expected params.id')

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

  const result = await validateSessionUser(request)

  const ddt = new DynamoDatetime({
    date: event.dateStart,
    time: event.timeStart,
  })

  return json<LoaderData>({
    eventItem: {
      ...event,
      dateStart: ddt.getFormattedDate(),
      description: event.description ?? '',
      isRace: event.race,
      me: result.hasSession ? result.user : undefined,
    },
    origin: getOrigin(host),
  })
}
