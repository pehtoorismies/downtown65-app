import {
  Avatar,
  Text,
  Button,
  Paper,
  Group,
  Switch,
  Divider,
  SimpleGrid,
  LoadingOverlay,
} from '@mantine/core'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
  Form,
} from '@remix-run/react'
import { IconLogout } from '@tabler/icons'
import { GraphQLClient } from 'graphql-request'
import { useEffect, useState } from 'react'
import { accessTokenCookie } from '~/cookies'
import type { GetProfileQuery } from '~/gql/types.gen'
import { getSdk } from '~/gql/types.gen'

const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment value 'process.env.${name}' is not set`)
  }
  return value
}

export const loader: LoaderFunction = async ({ request }) => {
  console.log('Loader!!!')
  const cookieHeader = request.headers.get('Cookie')
  const accessTokenJwt = await accessTokenCookie.parse(cookieHeader)

  const client = new GraphQLClient(getEnvironmentVariable('API_URL'))
  const { me } = await getSdk(client).GetProfile(undefined, {
    Authorization: `Bearer ${accessTokenJwt}`,
  })
  return json(me)
}

type Pref = {
  weekly: boolean
  eventCreated: boolean
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const action: ActionFunction = async ({ request }) => {
  console.log(
    'Action: process.env.AUTH_CLIENT_ID',
    process.env.AUTH_CLIENT_ID,
    process.env.AUTH_CLIENT_SECRET
  )
  const formData = await request.formData()
  const weekly = !!formData.get('weekly')
  const eventCreated = !!formData.get('eventCreated')
  // save data
  await sleep(4000)
  return json<Pref>({
    weekly: true,
    eventCreated: true,
  })
}

const Profile = () => {
  // const actionData = useActionData<Pref>()
  const transition = useTransition()
  console.log(transition)
  const { name, nickname, preferences } = useLoaderData<GetProfileQuery['me']>()
  const [emailSettings, setEmailSettings] = useState<Pref>({
    weekly: preferences.subscribeWeeklyEmail,
    eventCreated: preferences.subscribeEventCreationEmail,
  })

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
        <SimpleGrid cols={1} ml="lg">
          <Text size="lg" weight={500} mt="md">
            Sähköpostiasetukset:
          </Text>
          <Form method="post">
            <Switch
              name="eventCreated"
              label="Lähetä sähköposti, kun uusi tapahtuma luodaan."
              checked={emailSettings.eventCreated}
              onChange={(event) => {
                setEmailSettings({
                  weekly: emailSettings.weekly,
                  eventCreated: event.currentTarget.checked,
                })
              }}
              onLabel="ON"
              offLabel="OFF"
              size="lg"
            />
            <Switch
              name="weekly"
              label="Lähetä viikon tapahtumat sähköpostitse."
              onLabel="ON"
              offLabel="OFF"
              checked={emailSettings.weekly}
              onChange={(event) => {
                setEmailSettings({
                  weekly: event.currentTarget.checked,
                  eventCreated: emailSettings.eventCreated,
                })
              }}
              size="lg"
            />

            <Button
              type="submit"
              loading={transition.state === 'submitting'}
              disabled={
                preferences.subscribeWeeklyEmail === emailSettings.weekly &&
                preferences.subscribeEventCreationEmail ===
                  emailSettings.eventCreated
              }
              leftIcon={<IconLogout size={18} />}
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.blue[6],
                  border: 0,
                  height: 42,
                  paddingLeft: 20,
                  paddingRight: 20,

                  '&:hover': {
                    backgroundColor: theme.fn.darken(
                      theme.colors.blue[6],
                      0.05
                    ),
                  },
                },

                leftIcon: {
                  marginRight: 5,
                },
              })}
            >
              Tallenna
            </Button>
          </Form>
        </SimpleGrid>
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
