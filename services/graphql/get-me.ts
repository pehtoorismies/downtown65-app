import { getAuth0Management, getClient } from '../functions/support/auth'
import { User } from './signup'
import { Auth0UserResponse, toUser } from './support/auth0-user'

export const getMe = async (): Promise<User | undefined> => {
  const management = await getAuth0Management()
  const response = await management.getUser({ id: 'auth0Sub' })
  const auth0User = Auth0UserResponse.parse(response)
  return toUser(auth0User)
}
