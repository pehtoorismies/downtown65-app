import { createContext, useContext } from 'react'
import type { User } from '~/domain/user'

export const UserContext = createContext<User | undefined>(undefined)

export const useUserContext = (): User | undefined => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('Context undefined')
  }
  return context
}
