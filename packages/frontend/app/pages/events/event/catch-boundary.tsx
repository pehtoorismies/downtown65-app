import { Container, Title, Image, Text, Button } from '@mantine/core'
import { Link, useCatch } from '@remix-run/react'
import { IconArrowNarrowLeft } from '@tabler/icons'
import { mapToData } from '~/util/event-type'

export const CatchBoundary = () => {
  const caught = useCatch()
  const { imageUrl } = mapToData('ORIENTEERING')

  return (
    <Container py="lg">
      <Title my="sm" align="center" size={40}>
        {caught.status}
      </Title>
      <Image radius="md" src={imageUrl} alt="Random event image" />
      <Text align="center"> {caught.statusText}</Text>
      <Button
        component={Link}
        to="/"
        variant="outline"
        size="md"
        mt="xl"
        leftIcon={<IconArrowNarrowLeft size={18} />}
      >
        Etusivulle
      </Button>
    </Container>
  )
}
