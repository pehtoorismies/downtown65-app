import {
  Button,
  Container,
  Image,
  SimpleGrid,
  Stack,
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
    <Container p="md">
      <SimpleGrid spacing={30} cols={{ base: 1, sm: 2 }}>
        <Stack align="center" gap="xs" hiddenFrom="sm">
          <Image
            src="/404.jpg"
            style={{
              maxWidth: 300,
              margin: 'auto',
            }}
          />
          <Text c="gray.7" size="sm" component="figcaption">
            Your support contact
          </Text>
        </Stack>

        <div>
          <Title fw={900} className={classes.title}>
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
        <Stack align="center" gap="xs" visibleFrom="sm">
          <Image src="/404.jpg" />
          <Text c="gray.7" size="sm" component="figcaption">
            Your support contact
          </Text>
        </Stack>
      </SimpleGrid>
    </Container>
  )
}

export default NotFound
