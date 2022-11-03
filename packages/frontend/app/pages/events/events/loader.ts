import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client'
import type { EventLoaderData } from '~/pages/events/event-loader-data'
import { validateSessionUser } from '~/session.server'
import { formatDynamoDate } from '~/util/format-date'

export interface LoaderData {
  eventItems: EventLoaderData[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/login')
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
      ...formatDynamoDate(event.dateStart),
    }
  })

  const headers = result.headers ?? {}
  return json<LoaderData>({ eventItems: mapped }, { headers })
}
