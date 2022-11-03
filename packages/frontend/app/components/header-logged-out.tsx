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
            <Text>Downtown65</Text>
          </Group>
          <Group className={classes.hiddenMobile}>
            <Button component={Link} to="/login" variant="default">
              Kirjaudu
            </Button>
            <Button component={Link} to="/signup">
              Rekisteröidy
            </Button>
          </Group>
        </Group>
      </Header>
    </Box>
  )
}
