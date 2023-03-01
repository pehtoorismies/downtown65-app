import { PassThrough } from 'node:stream'
import { s3Key } from '@downtown65-app/common'
import type { S3Handler } from 'aws-lambda'
import AWS from 'aws-sdk'
import type { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3'
import pino from 'pino'
import sharp from 'sharp'

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

const AVATAR_WIDTH = 200

/**
 * Notification for avatar file upload
 *
 * @param event
 */
export const main: S3Handler = async (event) => {
  const s3Record = event.Records[0].s3
  const Key = s3Record.object.key
  logger.debug({ Key }, 'Received uploads file')
  const Bucket = s3Record.bucket.name

  const userAvatarDir = s3Key.getAvatarDir(Key)
  const filename = `avatar-w${AVATAR_WIDTH}.webp`
  const avatarKey = `${userAvatarDir}/${filename}`

  const readStream = readStreamFromS3({ Key, Bucket })
  const { writeStream, upload } = writeStreamToS3({
    Bucket,
    Key: avatarKey,
    ContentType: 'image/webp',
  })

  const filterStream = sharp().resize(AVATAR_WIDTH).webp()

  // Trigger the streams
  readStream.pipe(filterStream).pipe(writeStream)
  logger.debug(
    {
      Key: avatarKey,
    },
    'Start upload transformed file'
  )
  // Wait for the file to upload
  await upload
}
