import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { IconArrowNarrowLeft } from '@tabler/icons-react'
import classes from '../routes-styles/$.module.css'
import { getAuthenticatedUser, getSession } from '~/session.server'
//
// const useStyles = createStyles((theme) => ({
//   // root: {
//   //   paddingTop: 20,
//   //   paddingBottom: 120,
//   //   paddingRight: 30,
//   //   paddingLeft: 30,
//   // },
//
//   title: {
//     fontWeight: 900,
//     fontSize: 34,
//     marginBottom: theme.spacing.md,
//     fontFamily: `Greycliff CF, ${theme.fontFamily}`,
//
//     [theme.fn.smallerThan('sm')]: {
//       fontSize: 32,
//     },
//   },
//
//   control: {
//     [theme.fn.smallerThan('sm')]: {
//       width: '100%',
//     },
//   },
//
//   mobileImage: {
//     [theme.fn.largerThan('sm')]: {
//       display: 'none',
//     },
//     maxWidth: 300,
//     marginLeft: 'auto',
//     marginRight: 'auto',
//   },
//
//   desktopImage: {
//     [theme.fn.smallerThan('sm')]: {
//       display: 'none',
//     },
//   },
// }))

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser(request)
  if (user) {
    return json({ user })
  }

  await getSession(request)
  return json({})
}

const NotFound = () => {
  return (
    <Container
      styles={{
        root: {
          paddingTop: 20,
          paddingBottom: 120,
          paddingRight: 30,
          paddingLeft: 30,
        },
      }}
    >
      <SimpleGrid
        spacing={30}
        cols={2}
        // TODO: fix
        // breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
      >
        <Image
          src="/404.jpg"
          className={classes.mobileImage}
          // TODO: add caption
          // caption="Your support contact"
        />
        <div>
          <Title
            fw={900}
            // TODO: below all
            fs="34px"
            // styles={{
            //   marginBottom: theme.spacing.md,
            //   fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            //
            //   // [theme.fn.smallerThan('sm')]: {
            //   // fontSize: 32,
            // }}
          >
            PUMMI
          </Title>
          <Text c="dimmed" size="lg">
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
            leftSection={<IconArrowNarrowLeft size={18} />}
            data-testid="navigate-home"
          >
            Etusivulle
          </Button>
        </div>
        <Image
          src="/404.jpg"
          // className={classes.desktopImage}
          // TODO: add caption
          // caption="Your support contact"
        />
      </SimpleGrid>
    </Container>
  )
}

export default NotFound
