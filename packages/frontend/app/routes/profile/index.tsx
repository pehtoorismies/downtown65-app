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
  LoadingOverlay,
} from '@mantine/core'
import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useFetcher, useLoaderData, useSubmit } from '@remix-run/react'
import { IconAlertCircle, IconLogout } from '@tabler/icons'
import type { ChangeEventHandler } from 'react'
import React, { useRef, useState } from 'react'
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
  // TODO: how to sync user and cookie user ?
  // const { headers, accessToken, user } = await actionAuthenticate(request)
  const { headers, accessToken } = await actionAuthenticate(request)

  const formData = await request.formData()

  const eventCreated = formData.get('eventCreated') === 'on'
  const weekly = formData.get('weekly') === 'on'

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
  const userPreferences = (await userPrefsCookie.parse(cookieHeader)) ?? {}
  const showGravatarTip = userPreferences.showGravatarTip ?? true
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
  const fetcher = useFetcher()

  const gravatarFormReference = useRef(null)

  const { name, user, preferences, email, showGravatarTip } =
    useLoaderData<LoaderData>()
  const [hasGravatarTip, setGravatarTip] = useState(showGravatarTip)

  const [emailSettings, setEmailSettings] = useState<UserPreferences>({
    weekly: preferences.subscribeWeeklyEmail,
    eventCreated: preferences.subscribeEventCreationEmail,
  })

  const handleCreatedChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmailSettings({
      ...emailSettings,
      eventCreated: event.currentTarget.checked,
    })
    fetcher.submit(
      {
        eventCreated: event.currentTarget.checked ? 'on' : 'off',
        weekly: emailSettings.weekly ? 'on' : 'off',
      },
      { method: 'post' }
    )
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
          <Form
            method="post"
            action="/profile/user-prefs"
            ref={gravatarFormReference}
          >
            <input type="hidden" name="showGravatarTip" value="hidden" />
          </Form>
          <Center>
            <Alert
              onClose={() => {
                setGravatarTip(false)
                submit(gravatarFormReference.current)
              }}
              withCloseButton
              closeButtonLabel="Sulje"
              icon={<IconAlertCircle size={16} />}
              title="Info"
              color="gray"
              my="sm"
              sx={{ maxWidth: 300, width: '100%' }}
            >
              Profiilikuvasi on haettu palvelusta{' '}
              <Anchor href="https://gravatar.com" target="_blank">
                Gravatar
              </Anchor>
              , kun tilisi luotiin. Jos näet vain nimikirjaimet sinulla ei ole
              Gravatar-tiliä osoitteella {email}.
            </Alert>
          </Center>
        </>
      )}
      <Divider my="sm" label="Sähköpostiasetukset" labelPosition="center" />
      <Group position="center">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Fun fact"
          color="red"
        >
          Viikkosähköposti ei käytössä.
        </Alert>
      </Group>
      <Group position="center">
        <div style={{ position: 'relative' }}>
          {fetcher.state === 'submitting' && <LoadingOverlay visible />}
          <Switch
            styles={switchStyles}
            name="eventCreated"
            label="Lähetä sähköposti, kun uusi tapahtuma luodaan."
            checked={emailSettings.eventCreated}
            onChange={handleCreatedChange}
            onLabel="ON"
            offLabel="OFF"
            size="md"
          />
          <Switch
            disabled
            name="weekly"
            styles={switchStyles}
            label="Lähetä viikon tapahtumat sähköpostitse."
            onLabel="ON"
            offLabel="OFF"
            checked={preferences.subscribeWeeklyEmail}
            size="md"
          />
        </div>
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
