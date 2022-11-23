import { DynamoDatetime } from '@downtown65-app/common'
import { useLoaderData } from '@remix-run/react'
import { useReducer } from 'react'
import type { EventState } from '../components/event-state'
import { reducer } from '../components/reducer'
import type { LoaderData } from './loader'
import type { Context } from '~/contexts/participating-context'
import { EditOrCreate } from '~/pages/events/components/edit-or-create'

const getDateComponents = (
  d?: Date
): { month: string; year: string; day: string } | undefined => {
  if (!d) {
    return
  }

  return {
    day: `${d.getDate()}`,
    month: `${d.getMonth() + 1}`,
    year: `${d.getFullYear()}`,
  }
}

const getTimeComponents = (
  time: EventState['time']
): { minutes: string; hours: string } | undefined => {
  if (time.minutes === undefined || time.hours === undefined) {
    return
  }
  return {
    hours: `${time.hours}`,
    minutes: `${time.minutes}`,
  }
}

export const EditEvent = () => {
  // const fetcher = useFetcher()
  const { me, state, timeStart, dateStart } = useLoaderData<LoaderData>()
  const ddt = new DynamoDatetime({
    time: timeStart,
    date: dateStart,
  })

  const [eventState, dispatch] = useReducer(reducer, {
    ...state,
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

  // useEffect(() => {
  //   if (state.submitEvent) {
  //     fetcher.submit(
  //       {
  //         ...getDateComponents(state.date),
  //         ...getTimeComponents(state.time),
  //         description: state.description,
  //         eventType: state.eventType ?? '',
  //         isRace: state.isRace ? 'true' : 'false',
  //         location: state.location,
  //         participants: JSON.stringify(state.participants),
  //         subtitle: state.subtitle,
  //         title: state.title,
  //       },
  //       { method: 'post', action: '/events/new' }
  //     )
  //     dispatch({ kind: 'formSubmitted' })
  //   }
  // }, [
  //   fetcher,
  //   state.date,
  //   state.description,
  //   state.eventType,
  //   state.isRace,
  //   state.location,
  //   state.participants,
  //   state.submitEvent,
  //   state.subtitle,
  //   state.time,
  //   state.title,
  // ])

  return EditOrCreate({ state: eventState, me, dispatch, participatingActions })
}
