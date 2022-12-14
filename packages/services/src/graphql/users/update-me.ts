import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { Auth0UserResponse, toUser } from '../support/auth0-user'
import type { MutationUpdateMeArgs, MeUser } from '~/appsync.gen'
import { getAuth0Management } from '~/graphql/support/auth0'

export const updateMe: AppSyncResolverHandler<
  MutationUpdateMeArgs,
  MeUser
> = async (event) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const management = await getAuth0Management()
  const response = await management.updateUser(
    { id: identity.sub },
    {
      user_metadata: {
        subscribeWeeklyEmail:
          event.arguments.input.preferences.subscribeWeeklyEmail,
        subscribeEventCreationEmail:
          event.arguments.input.preferences.subscribeEventCreationEmail,
      },
    }
  )
  const auth0User = Auth0UserResponse.parse(response)
  return toUser(auth0User)
}
