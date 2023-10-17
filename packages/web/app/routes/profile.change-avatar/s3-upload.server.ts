import crypto from 'node:crypto'
import Stream, { PassThrough } from 'node:stream'
import type { UploadHandler } from '@remix-run/node'
import AWS from 'aws-sdk'
import sharp from 'sharp'
import invariant from 'tiny-invariant'
import { Config } from '~/config/config'
import { logger } from '~/util/logger.server'

const pageLogger = logger.child({ function: 'UploadHandler' })

const IMAGE_EXTENSION_REG_EXP = /.+\.(?<ext>gif|jpe?g|webp|jpeg|png|avif|svg)$/
const AUTH0 = /^auth0\|[\dA-Za-z]+$/
const AVATAR_WIDTH = 200

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
  return async ({ name, filename, data }) => {
    if (name !== 'file') {
      throw new Error(`Incorrect formData field '${name}. Should be 'file'`)
    }
    invariant(data, 'Expected data')
    invariant(filename, 'Expected filename')
    const suffix = crypto.randomBytes(20).toString('hex')

    const matches = filename.match(IMAGE_EXTENSION_REG_EXP)
    if (!matches || !matches.groups?.ext) {
      throw new Error(`Illegal file name or extension '${filename}'`)
    }
    if (!AUTH0.test(userId)) {
      throw new Error(`uploaderAuth0UserId is incorrect: '${userId}'`)
    }

    const s3CompliantUserIdDirectory = userId.replace('auth0|', 'auth0_')
    const avatarFilename = `avatar-${suffix}.webp`
    const key = `avatars/${s3CompliantUserIdDirectory}/${avatarFilename}`

    const resizeStream = sharp().resize(AVATAR_WIDTH).webp()

    const s3Stream = uploadStream({
      Key: key,
      ContentType: 'image/webp',
    })

    Stream.Readable.from(data).pipe(resizeStream).pipe(s3Stream.writeStream)

    pageLogger.debug({ avatarKey: key }, 'Start uploading avatar')

    await s3Stream.promise

    pageLogger.debug({ avatarKey: key }, 'Successfully uploaded avatar')

    return key
  }
}
