import {
  Anchor,
  Breadcrumbs,
  Container,
  Pagination,
  Table,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import React from 'react'
import { graphql } from '~/generated/gql'
import { GetUsersDocument } from '~/generated/graphql'
import { gqlClient } from '~/gql/get-gql-client.server'
import { loaderAuthenticate } from '~/session.server'

const _GqlIgnored = graphql(`
  query GetUsers($perPage: Int!, $page: Int!) {
    users(page: $page, perPage: $perPage) {
      users {
        id
        name
        nickname
      }
      length
      limit
      start
      total
    }
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - jäsenet',
    },
  ]
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, accessToken } = await loaderAuthenticate(request)

  const url = new URL(request.url)
  const page = defaultTo(1, url.searchParams.get('page'))
  const perPage = defaultTo(50, url.searchParams.get('per_page'))

  const response = await gqlClient.request(
    GetUsersDocument,
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

  return json({
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
  } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const hasPagination = userCount > perPage

  const rows = users.map((u, index) => (
    <Table.Tr key={u.id}>
      <Table.Td>
        <Anchor
          component={Link}
          to={`/members/${u.nickname}`}
          data-testid={`member-nick-${index}`}
        >
          {u.nickname}
        </Anchor>
      </Table.Td>
      <Table.Td data-testid={`member-name-${index}`}>{u.name}</Table.Td>
    </Table.Tr>
  ))

  return (
    <>
      <Container fluid mt="xs">
        <Breadcrumbs mb="xs">
          <Text data-testid="breadcrumbs-current">Jäsenet</Text>
        </Breadcrumbs>
      </Container>
      <Container>
        <Title>Jäsenet</Title>
        <Text c="dimmed" fw={500} mb="xs">
          Jäseniä yhteensä: {userCount}
        </Text>
        {hasPagination && (
          <Pagination
            withControls={false}
            total={numPages}
            value={currentPage}
            // TODO: fix below
            // position="left"
            my="md"
            onChange={(page) => {
              navigate(`?page=${page}&per_page=${perPage}`)
            }}
          />
        )}
        <Table
          striped
          withRowBorders
          highlightOnHover
          withTableBorder
          withColumnBorders
          horizontalSpacing="sm"
          verticalSpacing="sm"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nick</Table.Th>
              <Table.Th>Nimi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {hasPagination && (
          <Pagination
            withControls={false}
            total={numPages}
            value={currentPage}
            // TODO: fix below
            // position="left"
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
    </>
  )
}
