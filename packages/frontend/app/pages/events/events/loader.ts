import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import type { EventLoaderData } from '~/domain/event-loader-data'
import { getGqlSdk } from '~/gql/get-gql-client'
import { validateSessionUser } from '~/session.server'

export interface LoaderData {
  eventItems: EventLoaderData[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/auth/login')
  }

  const { events } = await getGqlSdk().GetEvents(
    {},
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const mapped = events.map((event) => {
    return {
      ...event,
      me: result.user,
      isRace: event.race,
      description: event.description ?? '',
    }
  })

  const headers = result.headers ?? {}
  return json<LoaderData>({ eventItems: mapped }, { headers })
}