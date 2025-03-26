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
import { honeypot } from '~/honeypot.server'
import {
  commitMessageSession,
  getMessageSession,
  setMessage,
} from '~/message.server'
import { AuthTitle } from '~/routes-common/auth/AuthTitle'
import { logger } from '~/util/logger.server'
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

type FormDataResponse =
  | {
      formData: FormData
      spam: false
    }
  | {
      type: string
      spam: true
    }

const getFormData = async (request: Request): Promise<FormDataResponse> => {
  const type = request.headers.get('content-type')
  if (!type?.startsWith('application/x-www-form-urlencoded')) {
    return {
      type: 'Content-Type is not: application/x-www-form-urlencoded',
      spam: true,
    }
  }

  try {
    const formData = await request.formData()
    await honeypot.check(formData)

    return {
      formData,
      spam: false,
    }
  } catch (error) {
    if (error instanceof SpamError) {
      logger.info(error, 'Honeypot field filled')
      return {
        type: 'Honeypot field filled',
        spam: true,
      }
    }

    logger.info(error, 'Possible spam request detected')
    return {
      type: 'Cannot parse form data',
      spam: true,
    }
  }
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
