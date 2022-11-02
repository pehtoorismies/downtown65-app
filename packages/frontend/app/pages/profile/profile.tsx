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
    <Paper radius="md" withBorder p="lg" m="lg">
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
              onClick={resetEmailPreferences}
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
