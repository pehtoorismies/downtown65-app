import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { Constants } from '~/constants'

const User = z.object({
  nickname: z.string(),
  name: z.string(),
  picture: z.string(),
})

type UserType = z.infer<typeof User>

export const useUser = () => {
  const [user, setUser] = useState<UserType | undefined>()

  useEffect(() => {
    const idToken = localStorage.getItem(Constants.ID_TOKEN)
    if (idToken) {
      const decoded = jwtDecode(idToken)
      const dtUser = User.parse(decoded)
      setUser(dtUser)
    }
  }, [])

  return user
}
