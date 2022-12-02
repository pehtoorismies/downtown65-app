import { DynamoDatetime } from '@downtown65-app/common'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import type { User } from '~/domain/user'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import type { EventLoaderData } from '~/pages/events/event-loader-data'
import { validateSessionUser } from '~/session.server'

export type LoaderData = {
  eventItem: EventLoaderData
  origin: string
  user?: User
}

export const getOrigin = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  const domainName = process.env['DOMAIN_NAME']
  if (!domainName) {
    throw new Error(`Environment value 'process.env.DOMAIN_NAME' is not set`)
  }
  return `https://${domainName}`
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
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Tapahtumaa ei löydy',
    })
  }

  const ddt = new DynamoDatetime({
    date: event.dateStart,
    time: event.timeStart,
  })

  const userSession = await validateSessionUser(request)

  const data = {
    eventItem: {
      ...event,
      dateStart: ddt.getFormattedDate(),
      description: event.description ?? '',
      isRace: event.race,
    },
    origin: getOrigin(),
  }

  return userSession.valid
    ? json<LoaderData>(
        {
          ...data,
          user: userSession.user,
          eventItem: {
            ...data.eventItem,
            me: userSession.user,
          },
        },
        { headers: userSession.headers }
      )
    : json<LoaderData>(data)
}
