import { useFetcher } from '@remix-run/react'
import { createContext, useContext, useState } from 'react'

export interface Context {
  onLeave: (id: string) => void
  onParticipate: (id: string) => void
  state: 'idle' | 'submitting' | 'loading'
  loadingId: string | undefined
  participationEnabled: boolean
}

export const ParticipatingContext = createContext<Context | undefined>(
  undefined,
)

export const useParticipatingContext = (): Context => {
  const context = useContext(ParticipatingContext)
  if (!context) {
    throw new Error('ParticipatingContext undefined')
  }
  return context
}

type EventType = 'event' | 'challenge'

const getActionPath = (eventType: EventType): string => {
  switch (eventType) {
    case 'challenge': {
      return '/challenges'
    }
    case 'event': {
      return '/events'
    }
  }
}

export const useParticipationActions = (eventType: 'event' | 'challenge') => {
  const fetcher = useFetcher()
  const [loadingId, setLoadingId] = useState<string | undefined>()
  const actionPath = getActionPath(eventType)

  return {
    onParticipate: (id: string) => {
      setLoadingId(id)
      fetcher.submit(
        {},
        {
          action: `${actionPath}/${id}/participate`,
          method: 'put',
        },
      )
    },
    onLeave: (id: string) => {
      setLoadingId(id)
      fetcher.submit(
        {},
        {
          action: `${actionPath}/${id}/leave`,
          method: 'put',
        },
      )
    },
    state: fetcher.state,
    loadingId,
    participationEnabled: true,
  }
}
