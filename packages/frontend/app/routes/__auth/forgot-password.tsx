import {
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Paper,
  Text,
  TextInput,
} from '@mantine/core'
import type { MetaFunction, ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { IconArrowLeft } from '@tabler/icons'
import { AuthTemplate } from './modules/auth-template'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import { commitSession, getSession, setSuccessMessage } from '~/message.server'
import { validateEmail } from '~/util/validation.server'

export { loader } from './modules/loader'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - forgot password',
  }
}

interface ActionData {
  error: string
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
  return redirect('/login', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

export default function ForgotPassword() {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()

  return (
    <AuthTemplate title="Salasana unohtunut">
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
          <Group position="apart" mt="lg">
            <Anchor component={Link} to="/login" size="sm">
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Kirjautumiseen</Box>
              </Center>
            </Anchor>

            <Button type="submit" loading={transition.state === 'submitting'}>
              Lähetä ohjeet
            </Button>
          </Group>
        </Form>
      </Paper>
    </AuthTemplate>
  )
}
