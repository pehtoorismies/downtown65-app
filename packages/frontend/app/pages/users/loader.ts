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
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/login')
  }

  const response = await getGqlSdk().GetUsers(
    {},
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const headers = result.headers ?? {}
  return json<LoaderData>({ users: response.users }, { headers })
}
