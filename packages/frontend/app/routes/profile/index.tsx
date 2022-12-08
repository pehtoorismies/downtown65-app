import {
  Alert,
  Anchor,
  Avatar,
  Button,
  Center,
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
import { json } from '@remix-run/node'
import { Form, useLoaderData, useSubmit, useTransition } from '@remix-run/react'
import { IconAlertCircle, IconLogout, IconX } from '@tabler/icons'
import { useRef, useState } from 'react'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { userPrefsCookie } from '~/routes/profile/modules/user-prefs-cookie'
import { actionAuthenticate, loaderAuthenticate } from '~/session.server'

export const meta: MetaFunction = () => {
  return {
    title: 'Dt65 - profile',
  }
}

interface ActionData {}

export const action: ActionFunction = async ({ request }) => {
  const { headers, accessToken, user } = await actionAuthenticate(request)

  const formData = await request.formData()
  const weekly = !!formData.get('weekly')
  const eventCreated = !!formData.get('eventCreated')

  await getGqlSdk().UpdateMe(
    {
      subscribeEventCreationEmail: eventCreated,
      subscribeWeeklyEmail: weekly,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )
  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(messageSession, 'Asetukset on päivitetty')

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
  email: string
  preferences: {
    subscribeWeeklyEmail: boolean
    subscribeEventCreationEmail: boolean
  }
  showGravatarTip: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie')
  const userPrefs = (await userPrefsCookie.parse(cookieHeader)) ?? {}
  const showGravatarTip = userPrefs.showGravatarTip ?? true
  // TODO: get user as well
  const { accessToken } = await loaderAuthenticate(request)

  const { me } = await getGqlSdk().GetProfile(
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )
  // TODO: can user / loaded data be not in sync: yes
  return json<LoaderData>({
    showGravatarTip,
    user: {
      nickname: me.nickname,
      id: me.id,
      picture: me.picture,
    },
    email: me.email,
    name: me.name,
    preferences: {
      subscribeWeeklyEmail: me.preferences.subscribeWeeklyEmail,
      subscribeEventCreationEmail: me.preferences.subscribeEventCreationEmail,
    },
  })
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
  const submit = useSubmit()

  const formReference = useRef(null)
  const transition = useTransition()
  const { name, user, preferences, email, showGravatarTip } =
    useLoaderData<LoaderData>()
  const [hasGravatarTip, setGravatarTip] = useState(showGravatarTip)

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
      <Text align="center" fw={500} size="sm">
        {name}
      </Text>
      <Text align="center" fw={500} size="sm">
        {email}
      </Text>
      {hasGravatarTip && (
        <>
          <Form method="post" action="/profile/user-prefs" ref={formReference}>
            <input type="hidden" name="showGravatarTip" value="hidden" />
          </Form>
          <Center>
            <Alert
              onClose={() => {
                setGravatarTip(false)
                submit(formReference.current)
              }}
              withCloseButton
              closeButtonLabel="Close alert"
              icon={<IconAlertCircle size={16} />}
              title="Protip!"
              color="gray"
              my="sm"
              sx={{ maxWidth: 300, width: '100%' }}
            >
              Voit luoda itsellesi profiililkuvan / avatarin osoitteessa:{' '}
              <Anchor href="https://gravatar.com" target="_blank">
                gravatar.com
              </Anchor>
            </Alert>
          </Center>
        </>
      )}
      <Divider my="sm" label="Sähköpostiasetukset" labelPosition="center" />
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
      <Divider my="sm" label="Kirjaudu ulos" labelPosition="center" />
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
