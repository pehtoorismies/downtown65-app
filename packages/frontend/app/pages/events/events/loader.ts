import { DynamoDatetime } from '@downtown65-app/common'
import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import type { EventLoaderData } from '~/pages/events/event-loader-data'
import { validateSessionUser } from '~/session.server'

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
    const ddt = new DynamoDatetime({
      date: event.dateStart,
      time: event.timeStart,
    })

    return {
      ...event,
      dateStart: ddt.getFormattedDate(),
      description: event.description ?? '',
      isRace: event.race,
      me: result.user,
    }
  })

  const headers = result.headers ?? {}
  return json<LoaderData>({ eventItems: mapped }, { headers })
}
