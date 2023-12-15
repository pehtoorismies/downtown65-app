import { graphql } from '@downtown65-app/graphql/gql'
import { CreateEventDocument } from '@downtown65-app/graphql/graphql'
import { Button, Center, Divider, Group, Modal, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { IconCircleOff, IconCircleX } from '@tabler/icons-react'
import React, { useReducer } from 'react'
import type { Context } from '~/contexts/participating-context'
import { gqlClient } from '~/gql/get-gql-client.server'
import {
  commitMessageSession,
  getMessageSession,
  setSuccessMessage,
} from '~/message.server'
import { EditOrCreate } from '~/routes-common/events/components/edit-or-create'
import { ActiveStep, reducer } from '~/routes-common/events/components/reducer'
import { getEventForm } from '~/routes-common/events/get-event-form'
import { actionAuthenticate, loaderAuthenticate } from '~/session.server'

const _GqlIgnored = graphql(`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`)

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Dt65 - new event',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await loaderAuthenticate(request)

  return json({
    user,
  })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { headers, user, accessToken } = await actionAuthenticate(request)

  const body = await request.formData()

  const {
    description,
    location,
    isRace,
    subtitle,
    title,
    type,
    time,
    date,
    participants,
  } = getEventForm(body)

  const { createEvent } = await gqlClient.request(
    CreateEventDocument,
    {
      input: {
        createdBy: user,
        dateStart: date,
        description: description.trim() === '' ? undefined : description,
        location,
        race: isRace,
        subtitle,
        timeStart: time,
        title,
        type,
        participants,
      },
    },
    {
      Authorization: `Bearer ${accessToken}`,
    }
  )

  const messageSession = await getMessageSession(request.headers.get('cookie'))
  setSuccessMessage(messageSession, 'Tapahtuman luonti onnistui')

  headers.append('Set-Cookie', await commitMessageSession(messageSession))

  return redirect(`/events/${createEvent.id}`, {
    headers,
  })
}

export default function NewEvent() {
  const [opened, handlers] = useDisclosure(false)
  const { user: me } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const [eventState, dispatch] = useReducer(reducer, {
    activeStep: ActiveStep.STEP_EVENT_TYPE,
    date: new Date(),
    description: '',
    isRace: false,
    location: '',
    participants: [],
    submitEvent: false,
    subtitle: '',
    time: {},
    title: '',
    kind: 'create',
  })

  const participatingActions: Context = {
    onLeave: () => {
      dispatch({ kind: 'leaveEvent', me })
    },
    onParticipate: () => {
      dispatch({ kind: 'participateEvent', me })
    },
    state: 'idle',
    loadingId: 'not-defined',
  }

  return (
    <>
      <Modal
        zIndex={2000}
        opened={opened}
        onClose={() => handlers.close()}
        title="Keskeytä tapahtuman luonti"
        closeButtonProps={{ 'aria-label': 'Close' }}
      >
        <Group
          justify="space-between"
          mt={50}
          data-testid="confirmation-modal-content"
        >
          <Button
            onClick={() => handlers.close()}
            leftSection={<IconCircleX size={18} />}
            data-testid="modal-close"
          >
            Sulje
          </Button>
          <Button
            onClick={() => navigate('/events')}
            name="action"
            value="delete"
            type="submit"
            color="red"
            rightSection={<IconCircleOff size={18} />}
            data-testid="modal-cancel-event-creation"
          >
            Keskeytä
          </Button>
        </Group>
      </Modal>
      <Title order={1} size="h5">
        Uusi tapahtuma: {eventState.title || 'ei nimeä'}
      </Title>
      <EditOrCreate
        cancelRedirectPath="/events"
        state={eventState}
        me={me}
        dispatch={dispatch}
        participatingActions={participatingActions}
      />
      <Divider my="sm" />
      <Center>
        <Button
          my="md"
          color="red"
          rightSection={<IconCircleOff size={18} />}
          onClick={handlers.open}
        >
          Keskeytä luonti
        </Button>
      </Center>
    </>
  )
}
