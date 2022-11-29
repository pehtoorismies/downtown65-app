import { Container, Text, Table, Title, Pagination } from '@mantine/core'
import { useLoaderData, useNavigate } from '@remix-run/react'
import type { LoaderData } from './loader'

export const Users = () => {
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
      <td>{u.nickname}</td>
      <td>{u.name}</td>
    </tr>
  ))

  return (
    <Container py="sm">
      <Title>Seuran jäsenet</Title>
      <Text c="dimmed" fw={500} mb="xs">
        Seuralla jäseniä: {userCount}kpl
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
