import { useFetcher } from '@remix-run/react'
import { createContext, useContext } from 'react'

export interface Context {
  onLeave: (eventId: string) => void
  onParticipate: (eventId: string) => void
  state: 'idle' | 'submitting' | 'loading'
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

  return {
    onParticipate: (eventId: string) => {
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
  }
}
