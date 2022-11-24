import { DynamoDatetime } from '@downtown65-app/common'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect, useReducer } from 'react'
import { reducer } from '../components/reducer'
import type { LoaderData } from './loader'
import type { Context } from '~/contexts/participating-context'
import { EditOrCreate } from '~/pages/events/components/edit-or-create'
import { eventStateToSubmittable } from '~/pages/events/components/event-state-to-submittable'

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
        method: 'put',
        action: `/events/${eventId}`,
      })
      dispatch({ kind: 'formSubmitted' })
    }
  }, [fetcher, eventState])

  return EditOrCreate({ state: eventState, me, dispatch, participatingActions })
}
