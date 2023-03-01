import { getEnvironmentVariable, s3Key } from '@downtown65-app/common'
import type { S3Handler } from 'aws-lambda'
import pino from 'pino'
import { getAuth0Management } from '~/graphql/support/auth0'

const logger = pino({ level: 'debug' })

export const main: S3Handler = async (event) => {
  const s3Record = event.Records[0].s3
  const Key = s3Record.object.key
  const MEDIA_DOMAIN = getEnvironmentVariable('MEDIA_DOMAIN')

  logger.debug({ Key }, 'Start to change avatar')

  const auth0serId = s3Key.getAuth0UserIdFromAvatarKey(Key)

  logger.debug({ auth0serId }, 'Grabbed user id from S3 key')

  const picture = `https://${MEDIA_DOMAIN}/${Key}`

  logger.debug({ pictureUrl: picture }, 'Created picture url')

  const management = await getAuth0Management()
  await management.updateUser({ id: auth0serId }, { picture })

  logger.info({ auth0serId, picture }, 'Successfully updated avatar')
}
