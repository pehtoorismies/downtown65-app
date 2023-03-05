const DIRECTORY_AVATAR_UPLOADS = 'uploads/avatars'
const DIRECTORY_AVATARS = 'avatars'

const AUTH0 = /^auth0\|[\dA-Za-z]+$/

const AVATAR_IMAGE_FILE =
  /^(?<filename>avatar-.+)\.(gif|jpe?g|webp|jpeg|png|avif|svg)$/

const IMAGE_EXTENSION_REG_EXP = /.+\.(?<ext>gif|jpe?g|webp|jpeg|png|avif|svg)$/

const createAvatarUploadKey = (
  filename: string,
  uploaderAuth0UserId: string,
  suffix: string
) => {
  const matches = filename.match(IMAGE_EXTENSION_REG_EXP)
  if (!matches || !matches.groups?.ext) {
    throw new Error(`Illegal file name or extension '${filename}'`)
  }

  if (!AUTH0.test(uploaderAuth0UserId)) {
    throw new Error(
      `uploaderAuth0UserId is incorrect: '${uploaderAuth0UserId}'`
    )
  }

  const fileExtension = matches.groups?.ext

  const s3CompliantUserId = uploaderAuth0UserId.replace('auth0|', 'auth0_')
  const avatarFilename = `avatar-${suffix}.${fileExtension}`
  const s3Key = `${DIRECTORY_AVATAR_UPLOADS}/${s3CompliantUserId}/${avatarFilename}`

  return {
    key: s3Key,
    filename: avatarFilename,
  }
}

const getAvatarResizeKeys = (filename: string, auth0UserId: string) => {
  const matches = filename.match(AVATAR_IMAGE_FILE)

  if (!matches || !matches.groups?.filename) {
    throw new Error(`Illegal file name '${filename}'`)
  }

  if (!AUTH0.test(auth0UserId)) {
    throw new Error(`Illegal Auth0 userId '${auth0UserId}'`)
  }

  const s3UserDir = auth0UserId.replace('auth0|', 'auth0_')

  return {
    sourceKey: `${DIRECTORY_AVATAR_UPLOADS}/${s3UserDir}/${filename}`,
    targetFilename: `${DIRECTORY_AVATARS}/${s3UserDir}/${matches.groups.filename}`,
  }
}

export const s3Key = {
  createAvatarUploadKey,
  getAvatarResizeKeys,
}
