import { createContext, useContext } from 'react'
import type { User } from '~/domain/user'

interface Context {
  user: User | undefined
}

export const UserContext = createContext<Context | undefined>(undefined)

export const useUserContext = (): Context => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('UserContext undefined')
  }
  return context
}
