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
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { IconArrowLeft } from '@tabler/icons'
import type { ActionData } from './action'
import { AuthTemplate } from '~/pages/auth/auth-template'

export const ForgotPassword = () => {
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
