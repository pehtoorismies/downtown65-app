import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Paper,
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
import { IconArrowLeft } from '@tabler/icons'
import type { ActionData } from './action'

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

export const ForgotPassword = () => {
  const actionData = useActionData<ActionData>()
  const transition = useTransition()
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
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor
              color="dimmed"
              size="sm"
              className={classes.control}
              onClick={() => navigation('/login')}
            >
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Takaisin kirjautumiseen</Box>
              </Center>
            </Anchor>
            <Button
              type="submit"
              className={classes.control}
              loading={transition.state === 'submitting'}
            >
              Lähetä ohjeet
            </Button>
          </Group>
        </Form>
      </Paper>
    </Container>
  )
}
