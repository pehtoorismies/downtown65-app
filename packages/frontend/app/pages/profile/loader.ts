import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client'
import { validateSessionUser } from '~/session.server'

export interface LoaderData {
  name: string
  nickname: string
  preferences: {
    subscribeWeeklyEmail: boolean
    subscribeEventCreationEmail: boolean
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/auth/login')
  }

  const { me } = await getGqlSdk().GetProfile(
    {},
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const headers = result.headers ?? {}
  return json<LoaderData>(me, { headers })
}