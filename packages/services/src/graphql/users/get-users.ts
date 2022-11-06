import type { AppSyncResolverHandler } from 'aws-lambda'
import { z } from 'zod'
import { Auth0UserResponse, toBaseUser } from '../support/auth0-user'
import type { OtherUser } from '~/appsync.gen'
import { getAuth0Management } from '~/graphql/support/auth0'
import type { EmptyArgs } from '~/graphql/support/empty-args'

const Auth0Users = z.array(Auth0UserResponse)

export const getUsers: AppSyncResolverHandler<
  EmptyArgs,
  OtherUser[]
> = async () => {
  const management = await getAuth0Management()
  const users = await management.getUsers()
  const auth0Users = Auth0Users.parse(users)

  return auth0Users.map((user) => toBaseUser(user))
}
