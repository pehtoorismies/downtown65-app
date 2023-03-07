import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { IconAlertCircle } from '@tabler/icons-react'
import { AuthTemplate } from './modules/auth-template'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import { Tokens, createUserSession } from '~/session.server'
import { logger } from '~/util/logger.server'
import { validateEmail } from '~/util/validation.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - login',
  }
}

export interface ActionData {
  emailError?: string
  passwordError?: string
  generalError?: string
}

export const action: ActionFunction = async ({ request }) => {
  const pageLogger = logger.child({
    page: { path: 'login', function: 'action' },
  })

  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const remember = formData.get('remember')

  pageLogger.info({ email }, 'Login action')

  if (!validateEmail(email)) {
    return json<ActionData>(
      { emailError: 'Väärän muotoinen sähköpostiosoite' },
      { status: 400 }
    )
  }

  if (typeof password !== 'string') {
    return json<ActionData>(
      { passwordError: 'Salasana puuttuu' },
      { status: 400 }
    )
  }

  try {
    const { login } = await getGqlSdk().Login(
      { email, password },
      getPublicAuthHeaders()
    )

    if (login.loginError && login.loginError.code === 'invalid_grant') {
      pageLogger.info(
        {
          error: login.loginError,
          email,
        },
        'Login error'
      )
      return json<ActionData>(
        { generalError: 'Email or password is invalid' },
        { status: 400 }
      )
    }

    // TODO: use discrimination
    const tokens = Tokens.parse(login.tokens)

    pageLogger.debug(
      {
        email,
      },
      'Successful login'
    )

    return createUserSession({
      request,
      tokens,
      redirectTo: '/events',
      rememberMe: remember === 'remember',
    })
  } catch (error) {
    pageLogger.error(
      {
        error,
        email,
      },
      'Unable login user'
    )
    return json<ActionData>({ generalError: 'Server error' }, { status: 500 })
  }
}

export default function Login() {
  const navigation = useNavigation()
  const actionData = useActionData<ActionData>()

  return (
    <AuthTemplate title="Kirjaudu">
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Rekisteröitymiseen tarvitset seuran jäsenyyden ja
        liittymistunnuksen.&nbsp;
        <Anchor component={Link} to="/signup" data-testid="to-signup">
          Rekisteröidy tästä.
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {actionData?.generalError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Virhe kirjautumisessa"
            color="red"
            mb="sm"
          >
            {actionData.generalError}
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
            aria-invalid={actionData?.emailError ? true : undefined}
            aria-describedby="email-error"
            required
          />
          <PasswordInput
            id="password"
            name="password"
            label="Salasana"
            placeholder="Salasanasi"
            aria-invalid={actionData?.passwordError ? true : undefined}
            required
            mt="md"
            aria-describedby="password-error"
          />
          <Checkbox
            name="remember"
            value="remember"
            mt="md"
            label="Muista minut tällä laitteella. Kirjautuminen voimassa 365 päivää."
          />

          <Group position="right" mt="md">
            <Anchor
              component={Link}
              to="/forgot-password"
              size="sm"
              data-testid="to-forgot-password"
            >
              Unohditko salasanan?
            </Anchor>
          </Group>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={navigation.state === 'submitting'}
            data-testid="submit-login"
          >
            Kirjaudu
          </Button>
        </Form>
      </Paper>
    </AuthTemplate>
  )
}
