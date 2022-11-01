import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core'
import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from '@remix-run/react'
import { IconArrowLeft } from '@tabler/icons'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { validateEmail } from '~/util/validation.server'

interface ActionData {
  error?: string
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')

  if (!validateEmail(email)) {
    return json<ActionData>(
      { error: 'Väärän muotoinen sähköpostiosoite' },
      { status: 400 }
    )
  }

  await getGqlSdk().ForgotPassword({ email }, getPublicAuthHeaders())

  const session = await getSession(request.headers.get('cookie'))
  setSuccessMessage(session, `Ohjeet lähetetty osoitteeseen: ${email}`)
  return redirect('/auth/login', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

const styles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}))

const ForgotPassword = () => {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const navigation = useNavigate()

  const { classes } = styles()

  return (
    <Container size={460} my={30}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Salasana unohtunut
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Syötä sähköpostiosoitteesi saadaksesi sähköpostiisi ohjeet salasanan
        resetoimiseksi.
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <Form method="post">
          <TextInput
            name="email"
            type="email"
            label="Sähköpostiosoitteesi"
            placeholder="me@downtown65.com"
            required
          />
          {actionData?.error && (
            <Text size="sm" ml="xs" color="red">
              {actionData.error}
            </Text>
          )}
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor
              color="dimmed"
              size="sm"
              className={classes.control}
              onClick={() => navigation('/auth/login')}
            >
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Takaisin kirjautumiseen</Box>
              </Center>
            </Anchor>
            <Button
              type="submit"
              className={classes.control}
              loading={transition.state === 'submitting'}
            >
              Lähetä ohjeet
            </Button>
          </Group>
        </Form>
      </Paper>
    </Container>
  )
}

export default ForgotPassword
