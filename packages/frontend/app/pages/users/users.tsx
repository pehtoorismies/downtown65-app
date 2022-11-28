import { Container, Text, Table, Title } from '@mantine/core'
import { useLoaderData } from '@remix-run/react'
import type { LoaderData } from './loader'

export const Users = () => {
  const { users } = useLoaderData<LoaderData>()

  const rows = users.map((u) => (
    <tr key={u.id}>
      <td>{u.nickname}</td>
      <td>{u.name}</td>
    </tr>
  ))

  return (
    <Container py="sm">
      <Title>Downtown65 Endurance ry jäsenet</Title>
      <Text c="dimmed" fw={500}>
        Jäseniä yhteensä: {users.length}kpl
      </Text>
      <Table striped withColumnBorders>
        <thead>
          <tr>
            <th>Nick</th>
            <th>Nimi</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Container>
  )
}
