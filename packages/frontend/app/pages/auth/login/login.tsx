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
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { IconAlertCircle } from '@tabler/icons'
import type { ActionData } from './action'
import { AuthTemplate } from '~/pages/auth/auth-template'

export const Login = () => {
  const transition = useTransition()
  const actionData = useActionData<ActionData>()

  return (
    <AuthTemplate title="Kirjaudu">
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Rekiteröitymiseen tarvitset seuran jäsenyyden ja liittymistunnuksen.
        <Anchor component={Link} to="/signup">
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
          <Group position="right" mt="md">
            <Anchor component={Link} to="/forgot-password" size="sm">
              Unohditko salasanan?
            </Anchor>
          </Group>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={
              transition.state === 'submitting' ||
              transition.state === 'loading'
            }
          >
            Kirjaudu
          </Button>
        </Form>
      </Paper>
    </AuthTemplate>
  )
}
