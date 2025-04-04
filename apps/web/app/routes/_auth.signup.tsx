import { assertUnreachable } from '@downtown65-app/util'
import {
  Alert,
  Anchor,
  Button,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core'
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { IconExclamationCircle } from '@tabler/icons-react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { graphql } from '~/generated/gql'
import { SignupDocument } from '~/generated/graphql'
import { PUBLIC_AUTH_HEADERS, gqlClient } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setMessage,
} from '~/message.server'
import { AuthTitle } from '~/routes-common/auth/AuthTitle'
import { getFormData } from '~/routes-common/auth/get-form-data'

export { loader } from '~/routes-common/auth/loader'

const _GglIgnored = graphql(`
  mutation Signup(
    $name: String!
    $email: AWSEmail!
    $password: String!
    $nickname: String!
    $registerSecret: String!
  ) {
    signup(
      input: {
        name: $name
        email: $email
        password: $password
        nickname: $nickname
        registerSecret: $registerSecret
      }
    ) {
      __typename
      ...SignupSuccessFragment
      ...SignupFieldErrorFragment
      ...SignupErrorFragment
    }
  }
  fragment SignupSuccessFragment on SignupSuccess {
    message
  }
  fragment SignupFieldErrorFragment on SignupFieldError {
    errors {
      message
      path
    }
  }
  fragment SignupErrorFragment on SignupError {
    message
    statusCode
    error
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - signup',
    },
  ]
}

const SignupForm = z.object({
  email: z.string(),
  name: z.string(),
  nickname: z.string(),
  password: z.string(),
  registerSecret: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const formDataResponse = await getFormData(request)
  if (formDataResponse.spam) {
    throw new Response('Spam detected. Try again.', { status: 400 })
  }
  const formData = formDataResponse.formData

  const signupForm = SignupForm.parse({
    email: formData.get('email'),
    password: formData.get('password'),
    nickname: formData.get('nickname'),
    registerSecret: formData.get('registerSecret'),
    name: formData.get('name'),
  })

  const { signup } = await gqlClient.request(
    SignupDocument,
    signupForm,
    PUBLIC_AUTH_HEADERS,
  )

  switch (signup.__typename) {
    case 'SignupSuccess': {
      const session = await getMessageSession(request.headers.get('cookie'))
      setMessage(session, {
        message: `Vahvistus lähetetty osoitteeseen: ${signupForm.email}`,
        type: 'success',
      })
      return redirect('/login', {
        headers: { 'Set-Cookie': await commitMessageSession(session) },
      })
    }
    case 'SignupFieldError': {
      return json(
        {
          serverError: null,
          fieldErrors: Object.fromEntries(
            signup.errors.map((t) => [t.path, t.message]),
          ),
        },
        { status: 400 },
      )
    }
    case 'SignupError': {
      return json(
        {
          serverError: {
            message: signup.message,
            error: signup.error,
          },
          fieldErrors: null,
        },
        { status: signup.statusCode },
      )
    }
  }

  // make sure switch case is exhaustive
  const { __typename } = signup
  assertUnreachable(__typename)
}

export default function Signup() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  return (
    <>
      <AuthTitle title="Rekisteröidy" />
      <Text size="sm" ta="center" mt={5}>
        Rekiteröitymiseen tarvitset seuran jäsenyyden ja liittymistunnuksen.
      </Text>
      {actionData?.serverError && (
        <Alert
          my="sm"
          variant="light"
          color="red"
          title="Server error"
          icon={<IconExclamationCircle />}
        >
          {actionData.serverError.message}
        </Alert>
      )}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form method="post">
          <HoneypotInputs label="Please leave this field blank" />
          <TextInput
            name="email"
            type="email"
            autoComplete="email"
            label="Sähköposti"
            placeholder="me@downtown65.com"
            required
            error={actionData?.fieldErrors?.email}
          />

          <PasswordInput
            name="password"
            label="Salasana"
            placeholder="Salasanasi"
            required
            mt="md"
            error={actionData?.fieldErrors?.password}
          />
          <TextInput
            name="name"
            label="Nimi"
            placeholder="Etunimi Sukunimi"
            required
            mt="md"
            error={actionData?.fieldErrors?.name}
          />
          <TextInput
            name="nickname"
            description="Tunnus/nickname, näkyy ilmoittautumisissa"
            label="Nickname"
            placeholder="setämies72"
            required
            mt="md"
            error={actionData?.fieldErrors?.nickname}
          />
          <PasswordInput
            name="registerSecret"
            label="Rekisteröintitunnus"
            description="Saat tämän seuralta."
            placeholder="supersecret"
            required
            mt="md"
            error={actionData?.fieldErrors?.registerSecret}
          />
          <Group justify="flex-end" mt="md">
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
            data-testid="submit-signup"
          >
            Rekisteröidy
          </Button>
        </Form>
      </Paper>
    </>
  )
}
