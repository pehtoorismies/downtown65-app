import { createContext, useContext } from 'react'
import type { User } from '~/domain/user'

export interface UserContext {
  user?: User
}

export const UserContext = createContext<UserContext | undefined>(undefined)

export const useUserContext = (): UserContext => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('Context undefined')
  }
  return context
}
