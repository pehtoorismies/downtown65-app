import * as crypto from 'node:crypto'
import { PassThrough } from 'node:stream'
import { getEnvironmentVariable } from '@downtown65-app/common'
import type { UploadHandler } from '@remix-run/node'
import { writeAsyncIterableToWritable } from '@remix-run/node'
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

async function uploadStreamToS3(
  data: AsyncIterable<Uint8Array>,
  filename: string,
  contentType: string
) {
  const stream = uploadStream({
    Key: filename,
    ContentType: contentType,
  })
  await writeAsyncIterableToWritable(data, stream.writeStream)
  const file = await stream.promise
  return file.Key
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

    const extension = filename?.split('.').pop()

    invariant(data, 'Expected data')
    invariant(extension, 'Expected image file extension')

    const rand = crypto.randomBytes(20).toString('hex')
    const profileFilename = `users/${userId}/avatar-${rand}.${extension}`
    const uploadedFileLocation = await uploadStreamToS3(
      data,
      profileFilename,
      contentType
    )

    return `https://${MEDIA_DOMAIN}/${uploadedFileLocation}`
  }
}
