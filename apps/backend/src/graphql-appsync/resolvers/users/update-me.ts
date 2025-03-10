import type { MeUser, MutationUpdateMeArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { getAuth0Management } from '~/common/auth0-clients'
import { parseAuth0UserResponse, toUser } from './support/auth0-user'

export const updateMe: AppSyncResolverHandler<
  MutationUpdateMeArgs,
  MeUser
> = async (event) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const { data } = await management.users.update(
    { id: identity.sub },
    {
      user_metadata: {
        subscribeWeeklyEmail:
          event.arguments.input.preferences.subscribeWeeklyEmail,
        subscribeEventCreationEmail:
          event.arguments.input.preferences.subscribeEventCreationEmail,
      },
    },
  )
  const auth0User = parseAuth0UserResponse(data)
  return toUser(auth0User)
}
