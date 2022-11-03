import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import type { EventLoaderData } from '~/pages/events/event-loader-data'
import { validateSessionUser } from '~/session.server'
import { formatDynamoDate } from '~/util/format-date'

export type LoaderData = {
  eventItem: EventLoaderData
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.id, 'Expected params.id')

  const { event } = await getGqlSdk().GetEvent(
    {
      eventId: params.id,
    },
    getPublicAuthHeaders()
  )

  if (!event) {
    throw new Response('Not Found', { status: 404 })
  }

  const result = await validateSessionUser(request)

  return json<LoaderData>({
    eventItem: {
      ...event,
      description: event.description ?? '',
      isRace: event.race,
      me: result.hasSession ? result.user : undefined,
      ...formatDynamoDate(event.dateStart),
    },
  })
}
