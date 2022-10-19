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
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  useNavigate,
  useActionData,
  useTransition,
} from '@remix-run/react'
import { IconAlertCircle } from '@tabler/icons'
import invariant from 'tiny-invariant'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
import { createUserSession } from '~/session.server'
import { validateEmail } from '~/util/validation'

export const meta: MetaFunction = () => {
  return {
    title: 'DT65 - Kirjaudu',
  }
}

interface ActionData {
  errors?: {
    email?: string
    password?: string
    general?: string
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: 'Väärä sähköpostiosoite' } },
      { status: 400 }
    )
  }

  if (typeof password !== 'string') {
    return json<ActionData>(
      { errors: { password: 'Salasana tarvitaan' } },
      { status: 400 }
    )
  }

  try {
    const { login } = await getGqlSdk().Login(
      { email, password },
      getPublicAuthHeaders()
    )

    if (login.loginError && login.loginError.code === 'invalid_grant') {
      return json<ActionData>(
        { errors: { general: 'Email or password is invalid' } },
        { status: 400 }
      )
      return json<ActionData>(
        { errors: { general: login.loginError?.message } },
        { status: 400 }
      )
    }

    invariant(login.tokens?.idToken, 'Expected tokens.idToken')
    invariant(login.tokens?.accessToken, 'Expected tokens.idToken')

    return createUserSession({
      request,
      authToken: login.tokens.accessToken,
      nickname: 'kissa',
      redirectTo: `/auth/login-success?idToken=${login.tokens.idToken}`,
    })
  } catch (error) {
    console.log(error)
    return json<ActionData>(
      { errors: { general: 'Server error' } },
      { status: 500 }
    )
  }
}

const Login = () => {
  const navigation = useNavigate()
  const transition = useTransition()
  const actionData = useActionData() as ActionData

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
        {actionData?.errors?.general && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Virhe kirjautumisessa"
            color="red"
            mb="sm"
          >
            {actionData?.errors?.general}
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
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            required
          />
          <PasswordInput
            id="password"
            name="password"
            label="Salasana"
            placeholder="Salasanasi"
            required
            mt="md"
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
