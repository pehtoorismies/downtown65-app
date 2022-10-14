import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core'
import { useNavigate } from '@remix-run/react'
import { IconArrowLeft } from '@tabler/icons'

const styles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}))

const ForgotPassword = () => {
  const navigation = useNavigate()

  const { classes } = styles()

  return (
    <Container size={460} my={30}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Salasana unohtunut
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Syötä sähköpostiosoitteesi saadaksesi sähköpostiisi ohjeet salasanan
        resetoimiseksi.
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput
          label="Sähköpostiosoitteesi"
          placeholder="me@downtown65.com"
          required
        />
        <Group position="apart" mt="lg" className={classes.controls}>
          <Anchor
            color="dimmed"
            size="sm"
            className={classes.control}
            onClick={() => navigation('/auth/login')}
          >
            <Center inline>
              <IconArrowLeft size={12} stroke={1.5} />
              <Box ml={5}>Takaisin kirjautumiseen</Box>
            </Center>
          </Anchor>
          <Button className={classes.control}>Lähetä ohjeet</Button>
        </Group>
      </Paper>
    </Container>
  )
}

export default ForgotPassword
