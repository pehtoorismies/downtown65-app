import { assertUnreachable } from '@downtown65-app/core/assert-unreachable'
import { graphql } from '@downtown65-app/graphql/gql'
import { LoginDocument } from '@downtown65-app/graphql/graphql'
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
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { IconAlertCircle } from '@tabler/icons-react'
import * as R from 'remeda'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import { AuthTemplate } from '~/routes-common/auth/auth-template'
import { createUserSession } from '~/session.server'
import { logger } from '~/util/logger.server'
import { validateEmail } from '~/util/validation.server'

export { loader } from '~/routes-common/auth/loader'

const GglIgnored = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      __typename
      ...TokensFragment
      ...ErrorFragment
    }
  }
  fragment TokensFragment on Tokens {
    accessToken
    idToken
    refreshToken
  }
  fragment ErrorFragment on LoginError {
    message
    statusCode
    error
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - login',
    },
  ]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const pageLogger = logger.child({
    page: { path: 'login', function: 'action' },
  })

  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const remember = formData.get('remember')

  pageLogger.info({ email }, 'Login action')

  if (!validateEmail(email)) {
    return json(
      { error: 'Väärän muotoinen sähköpostiosoite', field: 'email' },
      { status: 400 }
    )
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { error: 'Salasana puuttuu', field: 'password' },
      { status: 400 }
    )
  }

  const { login } = await gqlClient.request(
    LoginDocument,
    { email, password },
    PUBLIC_AUTH_HEADERS
  )

  switch (login.__typename) {
    case 'Tokens': {
      const tokens = R.omit(login, ['__typename'])

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
    }
    case 'LoginError': {
      const error = R.omit(login, ['__typename'])
      return json(
        { error: error.message, field: 'general' },
        { status: error.statusCode }
      )
    }
  }
  // make sure switch case is exhaustive
  const { __typename } = login
  assertUnreachable(__typename)
}

export default function Login() {
  const navigation = useNavigation()
  const actionData = useActionData<typeof action>()

  return (
    <AuthTemplate title="Kirjaudu">
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Rekisteröitymiseen tarvitset seuran jäsenyyden ja
        liittymistunnuksen.&nbsp;
        <Anchor component={Link} to="/signup" data-testid="to-signup">
          Rekisteröidy tästä.
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {actionData?.field === 'general' && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Virhe kirjautumisessa"
            color="red"
            mb="sm"
          >
            {actionData?.error}
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
            required
            error={actionData?.field === 'email' ? actionData.error : undefined}
          />
          <PasswordInput
            id="password"
            name="password"
            label="Salasana"
            placeholder="Salasanasi"
            required
            mt="md"
            error={
              actionData?.field === 'password' ? actionData.error : undefined
            }
          />
          <Checkbox
            name="remember"
            value="remember"
            mt="md"
            label="Muista minut tällä laitteella. Kirjautuminen voimassa 365 päivää."
          />

          <Group justify="flex-end" mt="md">
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
            loading={navigation.state !== 'idle'}
            data-testid="submit-login"
          >
            Kirjaudu
          </Button>
        </Form>
      </Paper>
    </AuthTemplate>
  )
}
