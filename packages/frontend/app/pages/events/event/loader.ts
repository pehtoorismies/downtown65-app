import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import type { User } from '~/domain/user'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import type { EventType } from '~/gql/types.gen'
import { validateSessionUser } from '~/session.server'

export type LoaderData = {
  eventItem: Awaited<{
    createdBy: User
    description: string
    id: string
    isRace: boolean
    location: string
    me?: User
    participants: User[]
    title: string
    type: EventType
  }>
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
