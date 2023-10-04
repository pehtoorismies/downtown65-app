import { Button, Group, Text } from '@mantine/core'
import { Link } from '@remix-run/react'

export const HeaderLoggedOut = () => {
  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        <Text style={{ userSelect: 'none' }}>Dt65 Events</Text>
        <Group ml="xl" gap={10} visibleFrom="sm">
          <Button
            component={Link}
            to="/login"
            variant="default"
            data-testid="button-to-login"
          >
            Kirjaudu
          </Button>
          <Button component={Link} to="/signup" data-testid="button-to-signup">
            Rekisteröidy
          </Button>
        </Group>
      </Group>
    </Group>
  )
}
