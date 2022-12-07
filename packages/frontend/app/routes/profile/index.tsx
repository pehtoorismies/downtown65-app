import {
  Avatar,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Switch,
  Text,
} from '@mantine/core'
import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData, useTransition } from '@remix-run/react'
import { IconLogout, IconX } from '@tabler/icons'
import { useState } from 'react'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { logout, getUserSession } from '~/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - profile',
  }
}

interface ActionData {}

export const action: ActionFunction = async ({ request }) => {
  const userSession = await getUserSession(request)
  if (!userSession.valid) {
    return redirect('/login')
  }

  const formData = await request.formData()
  const weekly = !!formData.get('weekly')
  const eventCreated = !!formData.get('eventCreated')

  await getGqlSdk().UpdateMe(
    {
      subscribeEventCreationEmail: eventCreated,
      subscribeWeeklyEmail: weekly,
    },
    {
      Authorization: `Bearer ${userSession.accessToken}`,
    }
  )
  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(messageSession, 'Asetukset on päivitetty')

  const headers = userSession.headers
  headers.append('Set-Cookie', await commitMessageSession(messageSession))

  return json<ActionData>(
    {},
    {
      headers,
    }
  )
}

interface LoaderData extends PrivateRoute {
  name: string
  preferences: {
    subscribeWeeklyEmail: boolean
    subscribeEventCreationEmail: boolean
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await getUserSession(request)

  if (!userSession.valid) {
    return logout(request)
  }

  const { me } = await getGqlSdk().GetProfile(
    {},
    {
      Authorization: `Bearer ${userSession.accessToken}`,
    }
  )

  return json<LoaderData>(
    {
      user: {
        nickname: me.nickname,
        id: me.id,
        picture: me.picture,
      },
      name: me.name,
      preferences: {
        subscribeWeeklyEmail: me.preferences.subscribeWeeklyEmail,
        subscribeEventCreationEmail: me.preferences.subscribeEventCreationEmail,
      },
    },
    { headers: userSession.headers }
  )
}

const switchStyles = {
  label: {
    paddingLeft: 0,
  },
  labelWrapper: {
    marginLeft: 10,
  },
}

interface UserPreferences {
  weekly: boolean
  eventCreated: boolean
}

export default function Profile() {
  const transition = useTransition()
  const { name, user, preferences } = useLoaderData<LoaderData>()
  const [emailSettings, setEmailSettings] = useState<UserPreferences>({
    weekly: preferences.subscribeWeeklyEmail,
    eventCreated: preferences.subscribeEventCreationEmail,
  })

  const resetEmailPreferences = () => {
    setEmailSettings({
      eventCreated: preferences.subscribeEventCreationEmail,
      weekly: preferences.subscribeWeeklyEmail,
    })
  }

  return (
    <Paper radius="md" withBorder p="lg" m="lg">
      <Avatar src={user.picture} size={120} radius={120} mx="auto" />
      <Text align="center" size="lg" weight={500} mt="md">
        {user.nickname}
      </Text>
      <Text align="center" color="dimmed" size="sm">
        {name}
      </Text>
      <Divider my="sm" />
      <Text size="lg" weight={500} mt="md">
        Sähköpostiasetukset
      </Text>
      <Group position="center">
        <Form method="post">
          <Switch
            styles={switchStyles}
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
            size="md"
          />
          <Switch
            name="weekly"
            styles={switchStyles}
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
            size="md"
          />

          <SimpleGrid
            mt="sm"
            cols={2}
            breakpoints={[{ maxWidth: 600, cols: 1, spacing: 'sm' }]}
          >
            <Button
              type="submit"
              loading={
                transition.state === 'submitting' ||
                transition.state === 'loading'
              }
              disabled={
                preferences.subscribeWeeklyEmail === emailSettings.weekly &&
                preferences.subscribeEventCreationEmail ===
                  emailSettings.eventCreated
              }
              leftIcon={<IconLogout size={18} />}
            >
              Tallenna asetukset
            </Button>
            <Button
              leftIcon={<IconX size={18} />}
              variant="light"
              onClick={resetEmailPreferences}
              disabled={
                preferences.subscribeWeeklyEmail === emailSettings.weekly &&
                preferences.subscribeEventCreationEmail ===
                  emailSettings.eventCreated
              }
            >
              Palauta muutokset
            </Button>
          </SimpleGrid>
        </Form>
      </Group>
      <Divider my="sm" />
      <Text size="lg" weight={500} mt="md">
        Uloskirjautuminen
      </Text>
      <Group position="center">
        <SimpleGrid cols={1} ml="lg">
          <Form action="/logout" method="post">
            <Button type="submit" leftIcon={<IconLogout size={18} />}>
              Kirjaudu ulos
            </Button>
          </Form>
        </SimpleGrid>
      </Group>
    </Paper>
  )
}
