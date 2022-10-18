import {
  Avatar,
  Text,
  Button,
  Paper,
  Group,
  Switch,
  SimpleGrid,
  Divider,
} from '@mantine/core'
import { IconLogout } from '@tabler/icons'

const Profile = () => {
  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      <Avatar
        src="https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png"
        size={120}
        radius={120}
        mx="auto"
      />
      <Text align="center" size="lg" weight={500} mt="md">
        pehtoorismies
      </Text>
      <Text align="center" color="dimmed" size="sm">
        Simo Salminen
      </Text>
      <Divider my="sm" />
      <Group position="center">
        <Switch.Group
          my="md"
          orientation="vertical"
          size="lg"
          label="Sähköpostiasetukset"
          description="Sähköpostiasetukset"
          offset="md"
        >
          <Switch
            labelPosition="left"
            label="Lähetä sähköposti, kun uusi tapahtuma luodaan."
            checked
            onLabel="ON"
            offLabel="OFF"
          />
          <Switch
            labelPosition="left"
            label="Lähetä viikon tapahtumat sähköpostitse."
            onLabel="ON"
            offLabel="OFF"
            checked={false}
          />
        </Switch.Group>
      </Group>
      <Divider my="sm" />
      <Group position="right">
        <Button
          leftIcon={<IconLogout size={18} />}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.blue[6],
              border: 0,
              height: 42,
              paddingLeft: 20,
              paddingRight: 20,

              '&:hover': {
                backgroundColor: theme.fn.darken(theme.colors.blue[6], 0.05),
              },
            },

            leftIcon: {
              marginRight: 5,
            },
          })}
        >
          Kirjaudu ulos
        </Button>
      </Group>
    </Paper>
  )
}

export default Profile
