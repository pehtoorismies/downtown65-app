import { DynamoDatetime } from '@downtown65-app/common'
import { Group, Text, ActionIcon, Divider } from '@mantine/core'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { IconEdit } from '@tabler/icons'
import { useEffect, useReducer } from 'react'
import { reducer } from '../components/reducer'
import type { LoaderData } from './loader'
import { Gradient } from '~/components/colors'
import type { Context } from '~/contexts/participating-context'
import { EditOrCreate } from '~/pages/events/components/edit-or-create'
import { eventStateToSubmittable } from '~/pages/events/support/event-state-to-submittable'

export const EditEvent = () => {
  const fetcher = useFetcher()
  const { me, initState, initTimeStart, initDateStart, eventId } =
    useLoaderData<LoaderData>()
  const ddt = new DynamoDatetime({
    time: initTimeStart,
    date: initDateStart,
  })

  const [eventState, dispatch] = useReducer(reducer, {
    ...initState,
    date: ddt.getDateObject(),
    time: ddt.getTimes() ?? {
      hours: undefined,
      minutes: undefined,
    },
  })
  const participatingActions: Context = {
    onLeave: () => {
      dispatch({ kind: 'leaveEvent', me })
    },
    onParticipate: () => {
      dispatch({ kind: 'participateEvent', me })
    },
    state: 'idle',
    loadingEventId: 'not-defined',
  }

  useEffect(() => {
    if (eventState.submitEvent) {
      fetcher.submit(eventStateToSubmittable(eventState), {
        method: 'post',
        action: `/events/edit/${eventId}`,
      })
      dispatch({ kind: 'formSubmitted' })
    }
  }, [fetcher, eventState])

  return (
    <>
      <EditOrCreate
        state={eventState}
        me={me}
        dispatch={dispatch}
        participatingActions={participatingActions}
      />
      <Divider mt="md" />
      <Group position="center">
        <ActionIcon variant="gradient" gradient={Gradient.dtPink}>
          <IconEdit size={18} />
        </ActionIcon>
        <Text ta="center" fz="md" my="md" fw={700} c="dtPink.4">
          {`Muokkaat tapahtumaa: ${initState.title}`}
        </Text>
      </Group>
    </>
  )
}
