import crypto from 'node:crypto'
import Stream, { PassThrough } from 'node:stream'
import { getEnvironmentVariable, s3Key } from '@downtown65-app/common'
import type { UploadHandler } from '@remix-run/node'
import AWS from 'aws-sdk'
import pino from 'pino'
import invariant from 'tiny-invariant'

const logger = pino({ level: 'debug' })

const STORAGE_BUCKET = getEnvironmentVariable('STORAGE_BUCKET')

const uploadStream = ({
  Key,
  ContentType,
}: Pick<AWS.S3.Types.PutObjectRequest, 'Key' | 'ContentType'>) => {
  const s3 = new AWS.S3()
  const pass = new PassThrough()
  return {
    writeStream: pass,
    promise: s3
      .upload({ Bucket: STORAGE_BUCKET, Key, Body: pass, ContentType })
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

    await s3Stream.promise

    logger.debug({ avatarKey }, 'Successfully upload avatar')

    return avatarKey.filename
  }
}
