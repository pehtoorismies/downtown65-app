import { PassThrough } from 'node:stream'
import type { S3Handler } from 'aws-lambda'
import AWS from 'aws-sdk'
import type { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3'
import pino from 'pino'
import { getAvatarAttributes } from '~/functions/image/get-avatar-attributes'

const S3 = new AWS.S3()

const logger = pino({ level: 'debug' })

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

export const main: S3Handler = async (event) => {
  const s3Record = event.Records[0].s3
  const Key = s3Record.object.key
  logger.debug({ Key }, 'Received uploads file')
  const Bucket = s3Record.bucket.name

  const attributes = getAvatarAttributes(Key)

  if (!attributes) {
    logger.debug({ Key }, 'Not avatar compliant upload')
    return
  }

  const readStream = readStreamFromS3({ Key, Bucket })
  const { writeStream, upload } = writeStreamToS3({
    Bucket,
    Key: attributes.Key,
    ContentType: attributes.ContentType,
  })

  // Trigger the streams
  readStream.pipe(attributes.filterStream).pipe(writeStream)
  logger.debug(
    {
      Key: attributes.Key,
      ContentType: attributes.ContentType,
    },
    'Start upload transformed file'
  )
  // Wait for the file to upload
  await upload
}
