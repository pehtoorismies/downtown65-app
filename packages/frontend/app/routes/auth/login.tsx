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
import { useNavigate } from '@remix-run/react'

const Login = () => {
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
        Kirjaudu
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Rekiteröitymiseen tarvitset seuran jäsenyyden ja liittymistunnuksen.{' '}
        <Anchor<'a'> size="sm" onClick={() => navigation('/auth/signup')}>
          Rekisteröidy tästä.
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Sähköposti"
          placeholder="me@downtown65.com"
          required
        />
        <PasswordInput
          label="Salasana"
          placeholder="Salasanasi"
          required
          mt="md"
        />
        <Group position="right" mt="md">
          <Anchor onClick={() => navigation('/auth/forgot-password')} size="sm">
            Unohditko salasanan?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl">
          Kirjaudu
        </Button>
      </Paper>
    </Container>
  )
}

export default Login
