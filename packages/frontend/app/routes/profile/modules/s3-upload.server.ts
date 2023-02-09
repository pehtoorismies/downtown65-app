import { PassThrough } from 'node:stream'
import { getEnvironmentVariable } from '@downtown65-app/common'
import type { UploadHandler } from '@remix-run/node'
import { writeAsyncIterableToWritable } from '@remix-run/node'
import AWS from 'aws-sdk'
import invariant from 'tiny-invariant'

const STORAGE_BUCKET = getEnvironmentVariable('STORAGE_BUCKET')

const uploadStream = ({ Key }: Pick<AWS.S3.Types.PutObjectRequest, 'Key'>) => {
  const s3 = new AWS.S3()
  const pass = new PassThrough()
  return {
    writeStream: pass,
    promise: s3.upload({ Bucket: STORAGE_BUCKET, Key, Body: pass }).promise(),
  }
}

export async function uploadStreamToS3(
  data: AsyncIterable<Uint8Array>,
  filename: string
) {
  const stream = uploadStream({
    Key: filename,
  })
  await writeAsyncIterableToWritable(data, stream.writeStream)
  const file = await stream.promise
  return file.Location
}

export const s3UploadHandler: UploadHandler = async ({
  name,
  filename,
  data,
}) => {
  if (name !== 'file') {
    throw new Error(`Incorrect formData field '${name}. Should be 'file'`)
  }
  invariant(filename, 'Expected filename')
  invariant(data, 'Expected data')

  const uploadedFileLocation = await uploadStreamToS3(data, filename)
  return uploadedFileLocation
}
