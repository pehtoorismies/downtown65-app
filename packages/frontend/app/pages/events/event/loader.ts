import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import type { EventLoaderData } from '~/domain/event-loader-data'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import { validateSessionUser } from '~/session.server'

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
    },
  })
}
