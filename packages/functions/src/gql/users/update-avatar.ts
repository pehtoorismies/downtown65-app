import type { MutationUpdateAvatarArgs } from '@downtown65-app/graphql/graphql'
import { logger } from '@downtown65-app/logger'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { Config } from 'sst/node/config'
import { getAuth0Management } from '~/gql/support/auth0'

export const updateAvatar: AppSyncResolverHandler<
  MutationUpdateAvatarArgs,
  boolean
> = async (event) => {
  const identity = event.identity as AppSyncIdentityOIDC

  logger.debug(identity, 'updateAvatar')
  // TODO: verify match between filename and identity

  const auth0serId = identity.sub
  const { uploadedFilename } = event.arguments

  const picture = `https://${Config.MEDIA_BUCKET_DOMAIN}/${uploadedFilename}`

  const management = await getAuth0Management()

  logger.debug(
    {
      picture,
    },
    'Update user avatar'
  )

  await management.users.update({ id: auth0serId }, { picture })

  return true
}
