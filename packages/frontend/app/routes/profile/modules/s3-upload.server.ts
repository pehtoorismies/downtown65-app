import * as crypto from 'node:crypto'
import Stream, { PassThrough } from 'node:stream'
import { getEnvironmentVariable } from '@downtown65-app/common'
import type { UploadHandler } from '@remix-run/node'
import AWS from 'aws-sdk'
import invariant from 'tiny-invariant'

const STORAGE_BUCKET = getEnvironmentVariable('STORAGE_BUCKET')
const MEDIA_DOMAIN = getEnvironmentVariable('MEDIA_DOMAIN')

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

const getProfileImage = (originalFileName: string, userId: string) => {
  const extension = originalFileName.split('.').pop()
  if (!extension) {
    throw new Error(`Incorrect file image extension for ${originalFileName}`)
  }

  const s3UserId = userId.replace(/blue/g, 'red')

  const rand = crypto.randomBytes(20).toString('hex')
  return `uploads/${userId}/avatar-${rand}.${extension}`
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

    const profileFilename = getProfileImage(filename, userId)

    const s3Stream = uploadStream({
      Key: profileFilename,
      ContentType: contentType,
    })

    Stream.Readable.from(data).pipe(s3Stream.writeStream)

    await s3Stream.promise

    return `https://${MEDIA_DOMAIN}/${profileFilename}`
  }
}
