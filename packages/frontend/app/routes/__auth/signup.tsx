import {
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import { AuthTemplate } from './modules/auth-template'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import type { SignupField, SignupPayload } from '~/gql/types.gen'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'

export { loader } from './modules/loader'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - signup',
  }
}

const SignupForm = z.object({
  email: z.string(),
  name: z.string(),
  nickname: z.string(),
  password: z.string(),
  registerSecret: z.string(),
})

interface ActionData {
  errors?: Partial<Record<SignupField, string>>
}

const toActionData = (
  errors: NonNullable<SignupPayload['errors']>
): ActionData => {
  return {
    errors: Object.fromEntries(errors.map((t) => [t.path, t.message])),
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const signupForm = SignupForm.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    nickname: formData.get('nickname'),
    registerSecret: formData.get('registerSecret'),
    name: formData.get('name'),
  })

  const { signup } = await getGqlSdk().Signup(
    signupForm,
    getPublicAuthHeaders()
  )

  if (signup.errors) {
    return json<ActionData>(toActionData(signup.errors), { status: 400 })
  }

  const session = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(
    session,
    `Vahvistus lähetetty osoitteeseen: ${signupForm.email}`
  )
  return redirect('/login', {
    headers: { 'Set-Cookie': await commitMessageSession(session) },
  })
}

export default function Signup() {
  const actionData = useActionData<ActionData>()
  const navigation = useNavigation()

  return (
    <AuthTemplate title="Rekisteröidy">
      <Text size="sm" align="center" mt={5}>
        Rekiteröitymiseen tarvitset seuran jäsenyyden ja liittymistunnuksen.
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form method="post">
          <TextInput
            name="email"
            label="Sähköposti"
            placeholder="me@downtown65.com"
            required
            error={!!actionData?.errors?.email}
          />
          {actionData?.errors?.email && (
            <Text color="red" size="sm" weight={500}>
              {actionData.errors.email}
            </Text>
          )}
          <PasswordInput
            name="password"
            label="Salasana"
            placeholder="Salasanasi"
            required
            mt="md"
            error={!!actionData?.errors?.password}
          />
          {actionData?.errors?.password && (
            <Text color="red" size="sm" weight={500}>
              {actionData.errors.password}
            </Text>
          )}
          <TextInput
            name="name"
            label="Nimi"
            placeholder="Etunimi Sukunimi"
            required
            mt="md"
            error={!!actionData?.errors?.name}
          />
          {actionData?.errors?.name && (
            <Text color="red" size="sm" weight={500}>
              {actionData.errors.name}
            </Text>
          )}
          <TextInput
            name="nickname"
            label="Lempinimi / nickname"
            placeholder="setämies72"
            required
            mt="md"
            error={!!actionData?.errors?.nickname}
          />
          {actionData?.errors?.nickname && (
            <Text color="red" size="sm" weight={500}>
              {actionData.errors.nickname}
            </Text>
          )}
          <PasswordInput
            name="registerSecret"
            label="Rekisteröintitunnus (kysy seuralta)"
            placeholder="supersecret"
            required
            mt="md"
            error={!!actionData?.errors?.registerSecret}
          />
          {actionData?.errors?.registerSecret && (
            <Text color="red" size="sm" weight={500}>
              {actionData.errors.registerSecret}
            </Text>
          )}

          <Group position="right" mt="md">
            <Anchor
              component={Link}
              to="/login"
              size="sm"
              data-testid="to-login"
            >
              Kirjautumiseen
            </Anchor>
          </Group>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={navigation.state === 'submitting'}
          >
            Rekisteröidy
          </Button>
        </Form>
      </Paper>
    </AuthTemplate>
  )
}
