import {
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
import { json } from '@remix-run/node'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { Form, useNavigate, useActionData } from '@remix-run/react'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client'
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
    const result = await getGqlSdk().Login(
      { email, password },
      getPublicAuthHeaders()
    )
    console.log('Success!')
    console.log(result)
  } catch (error) {
    console.log('Error!')
    console.error(JSON.stringify(error, undefined, 2))
  }

  return json<ActionData>(
    { errors: { email: 'Email is invalid' } },
    { status: 400 }
  )
}

const Login = () => {
  const navigation = useNavigate()
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
          <Button fullWidth mt="xl" type="submit">
            Kirjaudu
          </Button>
        </Form>
      </Paper>
    </Container>
  )
}

export default Login
