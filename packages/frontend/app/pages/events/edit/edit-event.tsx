import { DynamoDatetime } from '@downtown65-app/common'
import { Text, Divider } from '@mantine/core'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect, useReducer } from 'react'
import { reducer } from '../components/reducer'
import type { LoaderData } from './loader'
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
      <Divider mt="md" m="sm" />
      <Text ta="center" fz="md" fw={400} c="dtPink.4" mt="xs">
        Muokkaat tapahtumaa:
      </Text>
      <Text ta="center" fz="md" fw={700} c="dtPink.4">
        {`${initState.title}`}
      </Text>
    </>
  )
}
