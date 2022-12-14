import { createStyles, Header, Group, Button, Text, Box } from '@mantine/core'
import { Link } from '@remix-run/react'

const useStyles = createStyles((theme) => ({
  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}))

export const HeaderLoggedOut = () => {
  const { classes } = useStyles()

  return (
    <Box>
      <Header height={60} px="md" fixed>
        <Group position="apart" sx={{ height: '100%' }}>
          <Group>
            <Text sx={{ userSelect: 'none' }}>Dt65 Events</Text>
          </Group>
          <nav>
            <Group className={classes.hiddenMobile}>
              <Button
                component={Link}
                to="/login"
                variant="default"
                data-cy="button-to-login"
              >
                Kirjaudu
              </Button>
              <Button component={Link} to="/signup" data-cy="button-to-signup">
                Rekisteröidy
              </Button>
            </Group>
          </nav>
        </Group>
      </Header>
    </Box>
  )
}
