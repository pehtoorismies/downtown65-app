import { Config } from '@serverless-stack/node/config'
import { z } from 'zod'
import { getAuth0Management } from '../functions/support/auth'
import { Auth0UserResponse, toUser } from './support/auth0-user'

type Datetime = string

export type SignupArguments = {
  email: string
  name: string
  nickname: string
  password: string
  registerSecret: string
}

export type User = {
  id: string
  email: string
  name: string
  nickname: string
  preferences: {
    subscribeWeeklyEmail: boolean
    subscribeEventCreationEmail: boolean
  }
  createdAt: Datetime
  updatedAt?: Datetime
}

export const signup = async (
  input: SignupArguments
): Promise<User | undefined> => {
  if (input.registerSecret !== Config.REGISTER_SECRET) {
    throw new Error('Invalid register secret')
  }

  const user = {
    email: input.email,
    password: input.password,
    name: input.name,
    nickname: input.nickname,
  }

  const management = await getAuth0Management()
  const returnObject = await management.createUser({
    connection: 'Username-Password-Authentication',
    ...user,
    verify_email: true,
    email_verified: false,
    user_metadata: {
      subscribeWeeklyEmail: true,
      subscribeEventCreationEmail: true,
    },
    app_metadata: { role: 'USER' },
  })

  const auth0User = Auth0UserResponse.parse(returnObject)

  return toUser(auth0User)
}
