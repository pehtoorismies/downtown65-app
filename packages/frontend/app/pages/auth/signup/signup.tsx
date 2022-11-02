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
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from '@remix-run/react'
import type { ActionData } from './action'

export const Signup = () => {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
  const navigation = useNavigate()

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Rekisteröidy
      </Title>
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
            <Anchor onClick={() => navigation('/login')} size="sm">
              Kirjautumiseen
            </Anchor>
          </Group>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={transition.state === 'submitting'}
          >
            Rekisteröidy
          </Button>
        </Form>
      </Paper>
    </Container>
  )
}
