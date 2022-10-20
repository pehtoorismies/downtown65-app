import { useEffect, useState } from 'react'
import { Constants } from '~/constants'
import type { User } from '~/domain/user'
import { userFromIdToken } from '~/domain/user'

export const useUser = () => {
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    const idToken = localStorage.getItem(Constants.ID_TOKEN)
    if (idToken) {
      const user = userFromIdToken(idToken)
      setUser(user)
    }
  }, [])

  return user
}
