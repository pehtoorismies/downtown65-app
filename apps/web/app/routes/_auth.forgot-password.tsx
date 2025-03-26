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
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { SpamError } from 'remix-utils/honeypot/server'
import { graphql } from '~/generated/gql'
import { ForgotPasswordDocument } from '~/generated/graphql'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setMessage,
} from '~/message.server'
import { AuthTitle } from '~/routes-common/auth/AuthTitle'
import { getFormData } from '~/routes-common/auth/get-form-data'
import { validateEmail } from '~/util/validation.server'

export { loader } from '~/routes-common/auth/loader'

const _GglIgnored = graphql(`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - forgot password',
    },
  ]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formDataResponse = await getFormData(request)
  if (formDataResponse.spam) {
    throw new Response('Spam detected. Try again.', { status: 400 })
  }

  const email = formDataResponse.formData.get('email')

  if (!validateEmail(email)) {
    return json({ error: 'Väärän muotoinen sähköpostiosoite' }, { status: 400 })
  }

  await gqlClient.request(
    ForgotPasswordDocument,
    { email },
    PUBLIC_AUTH_HEADERS,
  )

  const session = await getMessageSession(request.headers.get('cookie'))
  setMessage(session, {
    message: `Ohjeet lähetetty osoitteeseen: ${email}`,
    type: 'success',
  })
  return redirect('/login', {
    headers: { 'Set-Cookie': await commitMessageSession(session) },
  })
}

export default function ForgotPassword() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  return (
    <>
      <AuthTitle title="Salasana unohtunut" />
      <Text c="dimmed" size="sm" ta="center">
        Syötä sähköpostiosoitteesi saadaksesi sähköpostiisi ohjeet salasanan
        resetoimiseksi.
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <Form method="post">
          <HoneypotInputs label="Please leave this field blank" />
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
    </>
  )
}
