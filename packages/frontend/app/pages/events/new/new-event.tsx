import { useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect, useReducer } from 'react'
import type { EventState } from '../components/event-state'
import { ActiveStep, reducer } from '../components/reducer'
import type { LoaderData } from './loader'
import type { Context } from '~/contexts/participating-context'
import { EditOrCreate } from '~/pages/events/components/edit-or-create'
import { eventStateToSubmittable } from '~/pages/events/support/event-state-to-submittable'

const INIT_STATE: EventState = {
  activeStep: ActiveStep.STEP_EVENT_TYPE,
  title: '',
  subtitle: '',
  location: '',
  isRace: false,
  time: {},
  description: 'asdadsjdasladskj adlkjadsladksj adlskj',
  participants: [],
  submitEvent: false,
}

export const NewEvent = () => {
  const fetcher = useFetcher()
  const { me } = useLoaderData<LoaderData>()
  const [eventState, dispatch] = useReducer(reducer, INIT_STATE)
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
      })
      dispatch({ kind: 'formSubmitted' })
    }
  }, [fetcher, eventState])

  return EditOrCreate({ state: eventState, me, dispatch, participatingActions })
}
