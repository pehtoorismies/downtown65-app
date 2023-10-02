import { Box, Button, Group, Text } from '@mantine/core'
import { Link } from '@remix-run/react'

export const HeaderLoggedOut = () => {
  // TODO: use AppShell
  return (
    <Box>
      {/*<Header height={60} px="md" fixed>*/}
      <Group justify="space-between" style={{ height: '100%' }}>
        <Group>
          <Text style={{ userSelect: 'none' }}>Dt65 Events</Text>
        </Group>
        <nav>
          <Group hiddenFrom="sm">
            <Button
              component={Link}
              to="/login"
              variant="default"
              data-testid="button-to-login"
            >
              Kirjaudu
            </Button>
            <Button
              component={Link}
              to="/signup"
              data-testid="button-to-signup"
            >
              Rekisteröidy
            </Button>
          </Group>
        </nav>
      </Group>
      {/*</Header>*/}
    </Box>
  )
}
