import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { validateSessionUser } from '~/session.server'

export interface LoaderData {
  users: {
    id: string
    name: string
    nickname: string
  }[]
  length: number
  limit: number
  start: number
  total: number
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/login')
  }

  const response = await getGqlSdk().GetUsers(
    {
      page: 0,
      perPage: 100,
    },
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const headers = result.headers ?? {}
  return json<LoaderData>(response.users, { headers })
}
