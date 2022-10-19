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

const Signup = () => {
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
        <TextInput
          name="email"
          label="Sähköposti"
          placeholder="me@downtown65.com"
          required
        />
        <PasswordInput
          name="password"
          label="Salasana"
          placeholder="Salasanasi"
          required
          mt="md"
        />
        <TextInput
          name="name"
          label="Nimi"
          placeholder="Etunimi Sukunimi"
          required
          mt="md"
        />
        <TextInput
          name="nickname"
          label="Lempinimi / nickname"
          placeholder="setämies72"
          required
          mt="md"
        />
        <PasswordInput
          name="registerSecret"
          label="Rekisteröintitunnus (kysy seuralta)"
          placeholder="supersecret"
          required
          mt="md"
        />

        <Group position="right" mt="md">
          <Anchor onClick={() => navigation('/auth/login')} size="sm">
            Kirjautumiseen
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" type="submit">
          Rekisteröidy
        </Button>
      </Paper>
    </Container>
  )
}

export default Signup
