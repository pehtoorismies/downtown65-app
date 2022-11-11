import { useFetcher } from '@remix-run/react'
import { createContext, useContext, useState } from 'react'

export interface Context {
  onLeave: (eventId: string) => void
  onParticipate: (eventId: string) => void
  state: 'idle' | 'submitting' | 'loading'
  loadingEventId: string | undefined
}

export const ParticipatingContext = createContext<Context | undefined>(
  undefined
)

export const useParticipatingContext = (): Context => {
  const context = useContext(ParticipatingContext)
  if (!context) {
    throw new Error('Context undefined')
  }
  return context
}

export const useParticipationActions = () => {
  const fetcher = useFetcher()
  const [loadingEventId, setLoadingEventId] = useState<string | undefined>()

  return {
    onParticipate: (eventId: string) => {
      setLoadingEventId(eventId)
      fetcher.submit(
        {
          action: 'participate',
        },
        {
          action: `/events/${eventId}`,
          method: 'post',
        }
      )
    },
    onLeave: (eventId: string) => {
      setLoadingEventId(eventId)
      fetcher.submit(
        {
          action: 'leave',
        },
        {
          action: `/events/${eventId}`,
          method: 'post',
        }
      )
    },
    state: fetcher.state,
    loadingEventId,
  }
}
