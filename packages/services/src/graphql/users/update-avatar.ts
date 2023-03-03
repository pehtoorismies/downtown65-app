import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import type { MutationUpdateAvatarArgs } from '~/appsync.gen'
import { getAuth0Management } from '~/graphql/support/auth0'

const MEDIA_BUCKET_NAME = Config.MEDIA_BUCKET_NAME
const MEDIA_BUCKET_DOMAIN = Config.MEDIA_BUCKET_DOMAIN

// TODO: remove notifications when https://github.com/serverless-stack/sst/issues/2522 is resolved
/**
 * This should be done already inside Remix lambda, but it does not support
 * "sharp".
 * see: https://github.com/serverless-stack/sst/issues/2522
 *
 * So we have to count on S3 Key to provide all the information
 *
 * Logic here:
 * uploads/avatars/auth0_12341234/avatar-123132.gif
 * =>
 * avatars/auth0_12341234/avatar.webp
 *
 */
export const updateAvatar: AppSyncResolverHandler<
  MutationUpdateAvatarArgs,
  boolean
> = async (event) => {
  const identity = event.identity as AppSyncIdentityOIDC

  const { s3Key: Key } = event

  const management = await getAuth0Management()
  return true
}
