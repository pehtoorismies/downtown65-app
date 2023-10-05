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
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { IconArrowLeft } from '@tabler/icons-react'
import { getGqlSdk, getPublicAuthHeaders } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { AuthTemplate } from '~/routes-common/auth/auth-template'
import { validateEmail } from '~/util/validation.server'

export { loader } from '~/routes-common/auth/loader'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - forgot password',
    },
  ]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = formData.get('email')

  if (!validateEmail(email)) {
    return json({ error: 'Väärän muotoinen sähköpostiosoite' }, { status: 400 })
  }

  await getGqlSdk().ForgotPassword({ email }, getPublicAuthHeaders())

  const session = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(session, `Ohjeet lähetetty osoitteeseen: ${email}`)
  return redirect('/login', {
    headers: { 'Set-Cookie': await commitMessageSession(session) },
  })
}

export default function ForgotPassword() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  return (
    <AuthTemplate title="Salasana unohtunut">
      <Text c="dimmed" size="sm" ta="center">
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
            error={actionData?.error ?? undefined}
          />
          <Group justify="space-between" mt="lg">
            <Anchor
              component={Link}
              to="/login"
              size="sm"
              data-testid="to-login"
            >
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Kirjautumiseen</Box>
              </Center>
            </Anchor>

            <Button type="submit" loading={navigation.state === 'submitting'}>
              Lähetä ohjeet
            </Button>
          </Group>
        </Form>
      </Paper>
    </AuthTemplate>
  )
}
