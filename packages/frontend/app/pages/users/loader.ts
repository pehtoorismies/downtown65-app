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
  userCount: number
  numPages: number
  currentPage: number
  perPage: number
  usersOnPage: number
  start: number
}

const defaultTo = (defaultValue: number, value: string | null): number => {
  if (value == undefined || value.length === 0) {
    return defaultValue
  }
  if (Number.isNaN(value)) {
    return defaultValue
  }
  return Number(value)
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (!result.hasSession) {
    return redirect('/login')
  }

  const url = new URL(request.url)
  const page = defaultTo(1, url.searchParams.get('page'))
  const perPage = defaultTo(50, url.searchParams.get('per_page'))

  const response = await getGqlSdk().GetUsers(
    {
      page: page - 1,
      perPage,
    },
    {
      Authorization: `Bearer ${result.accessToken}`,
    }
  )

  const {
    users: { users, total, length, limit, start },
  } = response

  const extra = total % limit !== 0 ? 1 : 0
  const numberPages = Math.floor(total / limit) + extra
  const currentPage = Math.floor(start / limit) + 1

  const headers = result.headers ?? {}
  return json<LoaderData>(
    {
      users,
      userCount: total,
      numPages: numberPages,
      currentPage,
      perPage: limit,
      usersOnPage: length,
      start,
    },
    headers
  )
}
