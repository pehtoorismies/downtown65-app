import {
  Alert,
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useNavigate,
  useActionData,
  useTransition,
} from '@remix-run/react'
import { IconAlertCircle } from '@tabler/icons'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import {
  createUserSession,
  Tokens,
  validateSessionUser,
} from '~/session.server'
import { validateEmail } from '~/util/validation.server'

export const meta: MetaFunction = () => {
  return {
    title: 'DT65 - Kirjaudu',
  }
}

type ErrorData = {
  type: 'error'
  email?: string
  password?: string
  general?: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const result = await validateSessionUser(request)

  if (result.hasSession) {
    const headers = result.headers ?? {}
    return redirect('/events', { headers })
  } else {
    return json({})
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  if (!validateEmail(email)) {
    return json<ErrorData>(
      { email: 'Väärä sähköpostiosoite', type: 'error' },
      { status: 400 }
    )
  }

  if (typeof password !== 'string') {
    return json<ErrorData>(
      { password: 'Salasana tarvitaan', type: 'error' },
      { status: 400 }
    )
  }

  try {
    const { login } = await getGqlSdk().Login(
      { email, password },
      getPublicAuthHeaders()
    )

    if (login.loginError && login.loginError.code === 'invalid_grant') {
      return json<ErrorData>(
        { general: 'Email or password is invalid', type: 'error' },
        { status: 400 }
      )
      return json<ErrorData>(
        { general: login.loginError?.message, type: 'error' },
        { status: 400 }
      )
    }

    const tokens = Tokens.parse(login.tokens)

    return createUserSession({
      request,
      tokens,
      redirectTo: '/events',
    })
  } catch (error) {
    console.error(error)
    return json<ErrorData>(
      { general: 'Server error', type: 'error' },
      { status: 500 }
    )
  }
}

const Login = () => {
  const navigation = useNavigate()
  const transition = useTransition()

  const actionData = useActionData<ErrorData>()

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Kirjaudu
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Rekiteröitymiseen tarvitset seuran jäsenyyden ja liittymistunnuksen.{' '}
        <Anchor<'a'> size="sm" onClick={() => navigation('/auth/signup')}>
          Rekisteröidy tästä.
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {actionData?.type === 'error' && actionData.general && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Virhe kirjautumisessa"
            color="red"
            mb="sm"
          >
            {actionData.general}
          </Alert>
        )}

        <Form method="post">
          <TextInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            label="Sähköposti"
            placeholder="me@downtown65.com"
            aria-invalid={
              actionData?.type === 'error' && actionData.email
                ? true
                : undefined
            }
            aria-describedby="email-error"
            required
          />
          <PasswordInput
            id="password"
            name="password"
            label="Salasana"
            placeholder="Salasanasi"
            aria-invalid={
              actionData?.type === 'error' && actionData.password
                ? true
                : undefined
            }
            required
            mt="md"
            aria-describedby="password-error"
          />
          <Group position="right" mt="md">
            <Anchor
              onClick={() => navigation('/auth/forgot-password')}
              size="sm"
            >
              Unohditko salasanan?
            </Anchor>
          </Group>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={transition.state === 'submitting'}
          >
            Kirjaudu
          </Button>
        </Form>
      </Paper>
    </Container>
  )
}

export default Login
