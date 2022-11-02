import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import type { EventCardRootProps } from '~/components/event-card/event-card-root'
import { getGqlSdk } from '~/gql/get-gql-client'
import { validateSessionUser } from '~/session.server'

export interface LoaderData {
  eventItems: Awaited<EventCardRootProps[]>
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
      participants: [],
    }
  })

  const headers = result.headers ?? {}
  return json<LoaderData>({ eventItems: mapped }, { headers })
}
