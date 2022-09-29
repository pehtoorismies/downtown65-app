import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import type { BaseUser } from '../appsync'
import { getAuth0Management } from '../functions/support/auth'
import type { EmptyArgs } from './gql'
import { Auth0UserResponse, toBaseUser } from './support/auth0-user'

const Auth0Users = z.array(Auth0UserResponse)

export const getUsers: AppSyncResolverHandler<
  EmptyArgs,
  BaseUser[]
> = async () => {
  const management = await getAuth0Management()
  const users = await management.getUsers()
  const auth0Users = Auth0Users.parse(users)

  return auth0Users.map((user) => toBaseUser(user))
}
