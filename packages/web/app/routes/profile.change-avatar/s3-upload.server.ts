import crypto from 'node:crypto'
import Stream, { PassThrough } from 'node:stream'
import { s3Key } from '@downtown65-app/core/s3-key'
import type { UploadHandler } from '@remix-run/node'
import AWS from 'aws-sdk'
import invariant from 'tiny-invariant'
import { Config } from '~/config/config'
import { logger } from '~/util/logger.server'

const pageLogger = logger.child({ function: 'UploadHandler' })

const uploadStream = ({
  Key,
  ContentType,
}: Pick<AWS.S3.Types.PutObjectRequest, 'Key' | 'ContentType'>) => {
  const s3 = new AWS.S3()
  const pass = new PassThrough()
  return {
    writeStream: pass,
    promise: s3
      .upload({ Bucket: Config.STORAGE_BUCKET, Key, Body: pass, ContentType })
      .promise(),
  }
}

export const createProfileUploadHandler = ({
  userId,
}: {
  userId: string
}): UploadHandler => {
  return async ({ name, contentType, filename, data }) => {
    if (name !== 'file') {
      throw new Error(`Incorrect formData field '${name}. Should be 'file'`)
    }
    invariant(data, 'Expected data')
    invariant(filename, 'Expected filename')
    const suffix = crypto.randomBytes(20).toString('hex')
    const avatarKey = s3Key.createAvatarUploadKey(filename, userId, suffix)

    const s3Stream = uploadStream({
      Key: avatarKey.key,
      ContentType: contentType,
    })

    Stream.Readable.from(data).pipe(s3Stream.writeStream)

    pageLogger.debug({ avatarKey }, 'Start uploadingavatar')

    await s3Stream.promise

    pageLogger.debug({ avatarKey }, 'Successfully uploaded avatar')

    return avatarKey.filename
  }
}
