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
import { Form, useLoaderData, useTransition } from '@remix-run/react'
import { IconLogout, IconX } from '@tabler/icons'
import { useState } from 'react'
import type { LoaderData } from './loader'

interface UserPreferences {
  weekly: boolean
  eventCreated: boolean
}

export const Profile = () => {
  const transition = useTransition()
  const { name, nickname, preferences } = useLoaderData<LoaderData>()
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
          <Form action="/logout" method="post">
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
