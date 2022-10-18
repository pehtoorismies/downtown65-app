import {
  Avatar,
  Text,
  Button,
  Paper,
  Group,
  Switch,
  Divider,
} from '@mantine/core'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { IconLogout } from '@tabler/icons'
import { GraphQLClient } from 'graphql-request'
import type { EventCardProperties } from '~/components/event-card'
import { accessTokenCookie } from '~/cookies'
import type { GetProfileQuery } from '~/gql/types.gen'
import { getSdk } from '~/gql/types.gen'
import { mapToData } from '~/util/event-type'

const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment value 'process.env.${name}' is not set`)
  }
  return value
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const accessTokenJwt = await accessTokenCookie.parse(cookieHeader)

  const client = new GraphQLClient(getEnvironmentVariable('API_URL'))
  const { me } = await getSdk(client).GetProfile(undefined, {
    Authorization: `Bearer ${accessTokenJwt}`,
  })

  return json(me)
}

const Profile = () => {
  const { name, nickname, preferences } = useLoaderData<GetProfileQuery['me']>()
  console.log('pr', preferences)
  return (
    <Paper radius="md" withBorder p="lg" m="md">
      <Avatar
        src="https://s.gravatar.com/avatar/176eb6f65cfff68dbcdde334af6e90da?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fpe.png"
        size={120}
        radius={120}
        mx="auto"
      />
      <Text align="center" size="lg" weight={500} mt="md">
        {nickname}
      </Text>
      <Text align="center" color="dimmed" size="sm">
        {name}
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
            checked={preferences.subscribeEventCreationEmail}
            onLabel="ON"
            offLabel="OFF"
          />
          <Switch
            labelPosition="left"
            label="Lähetä viikon tapahtumat sähköpostitse."
            onLabel="ON"
            offLabel="OFF"
            checked={preferences.subscribeWeeklyEmail}
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
