import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from '@mantine/core'
import { Link } from '@remix-run/react'

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 20,
    paddingBottom: 120,
    paddingRight: 30,
    paddingLeft: 30,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
    maxWidth: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}))

const NotFound = () => {
  const { classes } = useStyles()

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={30}
        cols={2}
        breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
      >
        <Image
          src="/404.jpg"
          className={classes.mobileImage}
          caption="Your support contact"
        />
        <div>
          <Title className={classes.title}>PUMMI</Title>
          <Text color="dimmed" size="lg">
            Sivua ei löytynyt. Tarkista oletko kirjoittanut osoitteen oikein.
            Sivu voi myös olla siirretty. Tai sitten joku muu on vialla. Contact
            support (kuvassa)!
          </Text>
          <Button
            component={Link}
            to="/"
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
          >
            Etusivulle
          </Button>
        </div>
        <Image
          src="/404.jpg"
          className={classes.desktopImage}
          caption="Your support contact"
        />
      </SimpleGrid>
    </Container>
  )
}

export default NotFound
