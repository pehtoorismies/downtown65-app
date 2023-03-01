const DIRECTORY_AVATAR_UPLOADS = 'uploads/avatars'
const DIRECTORY_AVATARS = 'avatars'

const createAvatarUploadKey = (
  filename: string,
  uploaderAuth0UserId: string,
  suffix: string
) => {
  const IMAGE_EXTENSION_REG_EXP =
    /.+\.(?<ext>gif|jpe?g|webp|jpeg|png|avif|svg)$/

  const matches = filename.match(IMAGE_EXTENSION_REG_EXP)
  if (!matches || !matches.groups?.ext) {
    throw new Error(`Illegal file name or extension '${filename}'`)
  }

  if (!/^auth0\|\w+$/.test(uploaderAuth0UserId)) {
    throw new Error(
      `uploaderAuth0UserId is incorrect: '${uploaderAuth0UserId}'`
    )
  }

  const fileExtension = matches.groups?.ext

  const s3CompliantUserId = uploaderAuth0UserId.replace('auth0|', 'auth0_')
  const avatarFilename = `avatar-${suffix}.${fileExtension}`
  const s3Key = `${DIRECTORY_AVATAR_UPLOADS}/${s3CompliantUserId}/${avatarFilename}`

  return s3Key
}

const getAvatarDir = (s3UploadKey: string) => {
  const UPLOADED_AVATAR_REGEXP =
    /^uploads\/(?<dir>avatars\/auth0_[\dA-Za-z]+)\/avatar-.+\.(gif|jpe?g|webp|jpeg|png|avif|svg)$/

  const matches = s3UploadKey.match(UPLOADED_AVATAR_REGEXP)
  if (!matches || !matches.groups?.dir) {
    throw new Error(
      `Illegal S3 Key for avatar upload '${s3UploadKey}'. Should be: ${DIRECTORY_AVATAR_UPLOADS}/auth0_123/avatar-123.ext`
    )
  }

  return matches.groups.dir
}

const getAuth0UserIdFromAvatarKey = (avatarS3Key: string) => {
  const AVATAR_REGEXP =
    /^avatars\/(?<s3compliantUserId>auth0_\w+)\/avatar-.+\.(gif|jpe?g|webp|jpeg|png|avif|svg)$/
  const matches = avatarS3Key.match(AVATAR_REGEXP)
  if (!matches || !matches.groups?.s3compliantUserId) {
    throw new Error(
      `Illegal S3 Key for avatar '${avatarS3Key}'. Should be: ${DIRECTORY_AVATARS}/auth0_123/avatar-123.webp`
    )
  }

  const userId = matches.groups.s3compliantUserId
  return userId.replace('auth0_', 'auth0|')
}

export const s3Key = {
  createAvatarUploadKey,
  getAvatarDir,
  getAuth0UserIdFromAvatarKey,
  DIRECTORY_AVATAR_UPLOADS,
  DIRECTORY_AVATARS,
}
