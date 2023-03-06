import { PassThrough } from 'node:stream'
import { s3Key } from '@downtown65-app/common'
import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import AWS from 'aws-sdk'
import type { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3'
import pino from 'pino'
import type { MutationUpdateAvatarArgs } from '~/appsync.gen'
import { getAuth0Management } from '~/graphql/support/auth0'
// eslint-disable-next-line unicorn/prefer-module
const sharp = require('sharp')

const MEDIA_BUCKET_NAME = Config.MEDIA_BUCKET_NAME
const MEDIA_BUCKET_DOMAIN = Config.MEDIA_BUCKET_DOMAIN

const logger = pino({
  level: 'debug',
})

const S3 = new AWS.S3()

const readStreamFromS3 = ({
  Bucket,
  Key,
}: Pick<GetObjectRequest, 'Bucket' | 'Key'>) => {
  return S3.getObject({ Bucket, Key }).createReadStream()
}

// Write stream for uploading to S3
const writeStreamToS3 = ({
  Bucket,
  Key,
  ContentType,
}: Pick<PutObjectRequest, 'Bucket' | 'Key' | 'ContentType'>) => {
  const pass = new PassThrough()

  return {
    writeStream: pass,
    upload: S3.upload({
      Key,
      Bucket,
      Body: pass,
      ContentType,
    }).promise(),
  }
}

const AVATAR_WIDTH = 200

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

  logger.debug(identity, 'updateAvatar')

  const auth0serId = identity.sub
  const { uploadedFilename } = event.arguments

  const { sourceKey, targetFilename } = s3Key.getAvatarResizeKeys(
    uploadedFilename,
    identity.sub
  )

  const avatarKey = `${targetFilename}.webp`

  const readStream = readStreamFromS3({
    Key: sourceKey,
    Bucket: MEDIA_BUCKET_NAME,
  })
  const filterStream = sharp().resize(AVATAR_WIDTH).webp()
  const { writeStream, upload } = writeStreamToS3({
    Bucket: MEDIA_BUCKET_NAME,
    Key: avatarKey,
    ContentType: 'image/webp',
  })

  // Trigger the streams
  readStream.pipe(filterStream).pipe(writeStream)

  logger.debug(
    {
      Key: avatarKey,
    },
    'Start upload transformed file'
  )

  await upload

  logger.debug(
    {
      Key: avatarKey,
    },
    'Success uploaded file'
  )

  const picture = `https://${MEDIA_BUCKET_DOMAIN}/${avatarKey}`

  const management = await getAuth0Management()

  logger.debug(
    {
      picture,
    },
    'Update user avatar'
  )

  await management.updateUser({ id: auth0serId }, { picture })

  return true
}
