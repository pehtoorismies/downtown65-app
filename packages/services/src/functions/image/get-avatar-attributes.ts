import sharp from 'sharp'

/**
 * This should be done already inside Remix lambda, but it does not support
 * "sharp".
 * see: https://github.com/serverless-stack/sst/issues/2522
 *
 * So we have to count on S3 Key to provide all the information
 *
 * Logic here:
 * uploads/auth0_12341234/avatars/avatar-123132.gif
 * =>
 * avatars/auth0_12341234/avatars/avatar.webp
 *
 */

// image/png, image/gif, image/jpeg, image/svg+xml, image/webp, image/avif
const AVATAR_UPLOAD_REGEXP =
  /^uploads\/(?<userId>\w+)\/avatars\/avatar-.+\.(gif|jpe?g|webp|jpeg|png|avif|svg)$/

const AVATAR_WIDTH = 200

export const getAvatarAttributes = (Key: string) => {
  const matches = Key.match(AVATAR_UPLOAD_REGEXP)

  if (!matches || !matches.groups) {
    return
  }

  const { userId } = matches.groups

  if (!userId) {
    throw new Error(`Wrong userId in avatar update ${Key}`)
  }

  return {
    Key: `avatars/${userId}/avatar-w${AVATAR_WIDTH}.webp`,
    filterStream: sharp().resize(AVATAR_WIDTH).webp(),
    ContentType: 'image/webp',
  }
}
