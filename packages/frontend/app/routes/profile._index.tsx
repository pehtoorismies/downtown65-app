import {
  Breadcrumbs,
  Button,
  Center,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Switch,
  Text,
} from '@mantine/core'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useFetcher, useLoaderData } from '@remix-run/react'
import { IconLogout } from '@tabler/icons-react'
import type { ChangeEventHandler } from 'react'
import React, { useState } from 'react'
import { ProfileBox } from '~/components/profile-box'
import type { PrivateRoute } from '~/domain/private-route'
import { getGqlSdk } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { actionAuthenticate, loaderAuthenticate } from '~/session.server'
import { logger } from '~/util/logger.server'

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
}

export const loader: LoaderFunction = async ({ request }) => {
  const pageLogger = logger.child({
    page: { path: 'profile', function: 'loader' },
  })
  pageLogger.info('Load page: profile')

  // TODO: get user as well
  const { accessToken, user } = await loaderAuthenticate(request)
  pageLogger.debug({ user }, 'Authenticated user')

  const { me } = await getGqlSdk().GetProfile(
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )
  // TODO: can user / loaded data be not in sync: yes
  return json<LoaderData>({
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

const BOX_SIZE = 'xs'

export default function Profile() {
  const fetcher = useFetcher()

  const { name, user, preferences, email } = useLoaderData<LoaderData>()

  const [emailSettings, setEmailSettings] = useState<UserPreferences>({
    weekly: preferences.subscribeWeeklyEmail,
    eventCreated: preferences.subscribeEventCreationEmail,
  })

  const onChangeEventCreatedSubscription: ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
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
    <>
      <Container fluid mt={75}>
        <Breadcrumbs mb="xs">
          <Text data-testid="breadcrumbs-current">Oma profiili</Text>
        </Breadcrumbs>
      </Container>
      <Container size={BOX_SIZE}>
        <ProfileBox
          picture={user.picture}
          nickname={user.nickname}
          name={name}
          email={email}
        ></ProfileBox>
        <Center mt="sm">
          <Form action="/profile/change-avatar">
            <Button
              compact
              size="xs"
              variant="outline"
              type="submit"
              data-testid="change-avatar-btn"
            >
              Vaihda profiilikuva
            </Button>
          </Form>
        </Center>
      </Container>
      <Container size={BOX_SIZE}>
        <Divider my="sm" label="Sähköpostiasetukset" labelPosition="center" />
        <Group position="center">
          <div style={{ position: 'relative' }}>
            {fetcher.state === 'submitting' && <LoadingOverlay visible />}
            <Switch
              styles={switchStyles}
              name="eventCreated"
              label="Lähetä sähköposti, kun uusi tapahtuma luodaan."
              checked={emailSettings.eventCreated}
              onChange={onChangeEventCreatedSubscription}
              onLabel="ON"
              offLabel="OFF"
              size="md"
              data-testid="preference-event-created"
            />
            <Switch
              disabled
              name="weekly"
              styles={switchStyles}
              label="Lähetä viikon tapahtumat sähköpostitse. (Ei käytössä)"
              onLabel="ON"
              offLabel="OFF"
              checked={preferences.subscribeWeeklyEmail}
              size="md"
              my="sm"
            />
          </div>
        </Group>
      </Container>
      <Container size={BOX_SIZE}>
        <Divider my="sm" label="Kirjaudu ulos" labelPosition="center" />
        <Group position="center">
          <SimpleGrid cols={1} ml="lg">
            <Form action="/logout" method="post">
              <Button
                type="submit"
                leftIcon={<IconLogout size={18} />}
                data-testid="profile-logout"
              >
                Kirjaudu ulos
              </Button>
            </Form>
          </SimpleGrid>
        </Group>
      </Container>
    </>
  )
}
