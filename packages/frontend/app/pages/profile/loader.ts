import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { logout, validateSessionUser } from '~/session.server'

export interface LoaderData {
  name: string
  nickname: string
  picture: string
  preferences: {
    subscribeWeeklyEmail: boolean
    subscribeEventCreationEmail: boolean
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await validateSessionUser(request)

  if (!userSession.valid) {
    return logout(request)
  }

  const { me } = await getGqlSdk().GetProfile(
    {},
    {
      Authorization: `Bearer ${userSession.accessToken}`,
    }
  )

  return json<LoaderData>(me, { headers: userSession.headers })
}
