import {
  Anchor,
  Container,
  Pagination,
  Table,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - jäsenet',
  }
}

interface LoaderData extends PrivateRoute {
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
  const { user, accessToken } = await loaderAuthenticate(request)

  const url = new URL(request.url)
  const page = defaultTo(1, url.searchParams.get('page'))
  const perPage = defaultTo(50, url.searchParams.get('per_page'))

  const response = await getGqlSdk().GetUsers(
    {
      page: page - 1,
      perPage,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )

  const {
    users: { users, total, length, limit, start },
  } = response

  const extra = total % limit === 0 ? 0 : 1
  const numberPages = Math.floor(total / limit) + extra
  const currentPage = Math.floor(start / limit) + 1

  return json<LoaderData>({
    user,
    users,
    userCount: total,
    numPages: numberPages,
    currentPage,
    perPage: limit,
    usersOnPage: length,
    start,
  })
}

export default function Users() {
  const {
    users,
    start,
    usersOnPage,
    userCount,
    numPages,
    currentPage,
    perPage,
  } = useLoaderData<LoaderData>()
  const navigate = useNavigate()
  const hasPagination = userCount > perPage

  const rows = users.map((u) => (
    <tr key={u.id}>
      <td>
        <Anchor component={Link} to={`/profile/${u.nickname}`}>
          {u.nickname}
        </Anchor>
      </td>
      <td>{u.name}</td>
    </tr>
  ))

  return (
    <Container py="sm">
      <Title>Seuran jäsenet</Title>
      <Text c="dimmed" fw={500} mb="xs">
        Jäseniä yhteensä: {userCount}
      </Text>

      {hasPagination && (
        <Pagination
          withControls={false}
          total={numPages}
          page={currentPage}
          position="left"
          my="md"
          onChange={(page) => {
            navigate(`?page=${page}&per_page=${perPage}`)
          }}
        />
      )}
      <Table striped withColumnBorders>
        <thead>
          <tr>
            <th>Nick</th>
            <th>Nimi</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {hasPagination && (
        <Pagination
          withControls={false}
          total={numPages}
          page={currentPage}
          position="left"
          my="md"
          onChange={(page) => {
            navigate(`?page=${page}&per_page=${perPage}`)
          }}
        />
      )}
      <Text c="dimmed" fw={500} my="sm">
        Tulokset: {start + 1} - {start + usersOnPage} ({userCount})
      </Text>
    </Container>
  )
}
