import { Container } from '@mantine/core'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - index',
  }
}

const Index = () => {
  return <Container pt={12}>Index</Container>
}

export default Index
