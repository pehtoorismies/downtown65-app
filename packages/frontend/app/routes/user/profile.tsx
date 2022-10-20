import {
  Avatar,
  Text,
  Button,
  Paper,
  Group,
  Switch,
  Divider,
  SimpleGrid,
} from '@mantine/core'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, useTransition, Form } from '@remix-run/react'
import { IconLogout, IconX } from '@tabler/icons'
import { GraphQLClient } from 'graphql-request'
import { useState } from 'react'
import { getGqlSdk } from '~/gql/get-gql-client'
import type { GetProfileQuery } from '~/gql/types.gen'
import { getSdk } from '~/gql/types.gen'
import { getJwtFromSession } from '~/session.server'

const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment value 'process.env.${name}' is not set`)
  }
  return value
}

export const loader: LoaderFunction = async ({ request }) => {
  const accessTokenJwt = await getJwtFromSession(request)
  if (!accessTokenJwt) {
    return redirect('/auth/login')
  }

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const weekly = !!formData.get('weekly')
  const eventCreated = !!formData.get('eventCreated')
  const accessTokenJwt = await getJwtFromSession(request)

  const { updateMe } = await getGqlSdk().UpdateMe(
    {
      subscribeEventCreationEmail: eventCreated,
      subscribeWeeklyEmail: weekly,
    },
    {
      Authorization: `Bearer ${accessTokenJwt}`,
    }
  )

  return json<Pref>({
    weekly: updateMe.preferences.subscribeWeeklyEmail,
    eventCreated: updateMe.preferences.subscribeEventCreationEmail,
  })
}

const Profile = () => {
  const transition = useTransition()
  const { name, nickname, preferences } = useLoaderData<GetProfileQuery['me']>()
  const [emailSettings, setEmailSettings] = useState<Pref>({
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
              my="md"
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

            <Group position="apart">
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
                    backgroundColor: theme.colors.dtPink[6],
                    border: 0,
                    height: 42,
                    paddingLeft: 20,
                    paddingRight: 20,

                    '&:hover': {
                      backgroundColor: theme.fn.darken(
                        theme.colors.dtPink[6],
                        0.05
                      ),
                    },
                  },

                  leftIcon: {
                    marginRight: 5,
                  },
                })}
              >
                Tallenna asetukset
              </Button>
              <Button
                ml="md"
                leftIcon={<IconX size={18} />}
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
                onClick={resetEmailPreferences}
              >
                Palauta muutokset
              </Button>
            </Group>
          </Form>
        </SimpleGrid>
      </Group>
      <Divider my="sm" />
      <Group position="center">
        <SimpleGrid cols={1} ml="lg">
          <Text size="lg" weight={500} mt="md">
            Uloskirjautuminen:
          </Text>
          <Form action="/auth/logout" method="post">
            <Button
              type="submit"
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
              Kirjaudu ulos
            </Button>
          </Form>
        </SimpleGrid>
      </Group>
    </Paper>
  )
}

export default Profile
