import { getEnvironmentVariable } from '@downtown65-app/common'
import type { S3Handler } from 'aws-lambda'
import { getAuth0Management } from '~/graphql/support/auth0'

// image/png, image/gif, image/jpeg, image/svg+xml, image/webp, image/avif
const AVATAR_REGEXP =
  /^avatars\/(?<s3compliantUserId>\w+)\/avatar-.+\.(gif|jpe?g|webp|jpeg|png|avif|svg)$/

const USER_ID_REGEXP = /^auth0_(?<auth0userId>\w+)$/

const getAuth0UserId = (Key: string) => {
  const keyMatches = Key.match(AVATAR_REGEXP)

  if (!keyMatches || !keyMatches.groups?.s3compliantUserId) {
    return
  }

  const s3compliantUserId = keyMatches.groups?.s3compliantUserId

  if (!s3compliantUserId) {
    throw new Error(`Wrong s3compliantUserId in avatar update ${Key}`)
  }

  const userIdMatches = s3compliantUserId.match(USER_ID_REGEXP)

  if (!userIdMatches || !userIdMatches.groups?.auth0userId) {
    throw new Error(`Wrong auth0userId in avatar update ${Key}`)
  }

  const { auth0userId } = userIdMatches.groups
  return `auth0|${auth0userId}`
}

export const main: S3Handler = async (event) => {
  const s3Record = event.Records[0].s3
  const Key = s3Record.object.key
  const MEDIA_DOMAIN = getEnvironmentVariable('MEDIA_DOMAIN')

  console.log('Avatar change', Key)
  const userId = getAuth0UserId(Key)

  console.log('User id', userId)

  if (!userId) {
    return
  }

  const picture = `https://${MEDIA_DOMAIN}/${Key}`

  const management = await getAuth0Management()
  await management.updateUser({ id: userId }, { picture })

  console.log('Succefully updated picture')
}
