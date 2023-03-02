import { describe, expect, test } from 'vitest'
import { s3Key } from '../s3-key'

describe('createAvatarUploadKey', () => {
  test.each([
    {
      filename: 'kissa koira.jpg',
      uploaderAuth0UserId: 'auth0|123123',
      suffix: '123',
      expected: `${s3Key.DIRECTORY_AVATAR_UPLOADS}/auth0_123123/avatar-123.jpg`,
    },
    {
      filename: 'kissa koira.jpeg',
      uploaderAuth0UserId: 'auth0|abc',
      suffix: 'asd',
      expected: `${s3Key.DIRECTORY_AVATAR_UPLOADS}/auth0_abc/avatar-asd.jpeg`,
    },
    {
      filename: 'kissa koira.gif',
      uploaderAuth0UserId: 'auth0|abc',
      suffix: 'asd',
      expected: `${s3Key.DIRECTORY_AVATAR_UPLOADS}/auth0_abc/avatar-asd.gif`,
    },
  ])(
    'createAvatarUploadKey($uploaderAuth0UserId) -> $expected',
    ({ filename, uploaderAuth0UserId, suffix, expected }) => {
      expect(
        s3Key.createAvatarUploadKey(filename, uploaderAuth0UserId, suffix)
      ).toEqual(expected)
    }
  )

  test('wrong auth0 user id', () => {
    expect(() =>
      s3Key.createAvatarUploadKey('kissa koira.jpg', '123123', '123')
    ).toThrowError(/uploaderAuth0UserId is incorrect/)

    expect(() =>
      s3Key.createAvatarUploadKey('123.jpeg', 'auth0|auth0|123123', '123')
    ).toThrowError(/uploaderAuth0UserId is incorrect/)
  })
})

describe('getAvatarDir', () => {
  test.each([
    {
      s3UploadKey: `${s3Key.DIRECTORY_AVATAR_UPLOADS}/auth0_123123/avatar-123.gif`,
      expected: {
        dir: `${s3Key.DIRECTORY_AVATARS}/auth0_123123`,
        file: 'avatar-123',
      },
    },
    {
      s3UploadKey: `${s3Key.DIRECTORY_AVATAR_UPLOADS}/auth0_123123/avatar-321.jpg`,
      expected: {
        dir: `${s3Key.DIRECTORY_AVATARS}/auth0_123123`,
        file: 'avatar-321',
      },
    },
  ])(
    'createAvatarUploadKey($s3UploadedKey) -> $expected',
    ({ s3UploadKey, expected }) => {
      expect(s3Key.getAvatarDir(s3UploadKey)).toMatchObject(expected)
    }
  )

  test('wrong avatar upload directory', () => {
    expect(() => s3Key.getAvatarDir('kissa koira.jpg')).toThrowError(
      /Illegal S3 Key for avatar upload/
    )

    expect(() =>
      s3Key.getAvatarDir(`${s3Key.DIRECTORY_AVATAR_UPLOADS}/123.jpeg`)
    ).toThrowError(/Illegal S3 Key for avatar upload/)

    expect(() =>
      s3Key.getAvatarDir(
        `${s3Key.DIRECTORY_AVATAR_UPLOADS}/tmp/avatar-123.jpeg`
      )
    ).toThrowError(/Illegal S3 Key for avatar upload/)
  })
})

describe('getAuth0UserIdFromAvatarKey', () => {
  test.each([
    {
      s3UploadedKey: `${s3Key.DIRECTORY_AVATARS}/auth0_123123/avatar-123.gif`,
      expected: 'auth0|123123',
    },
    {
      s3UploadedKey: `${s3Key.DIRECTORY_AVATARS}/auth0_asd1231/avatar-123.gif`,
      expected: 'auth0|asd1231',
    },
  ])(
    'createAvatarUploadKey($s3UploadedKey) -> $expected',
    ({ s3UploadedKey, expected }) => {
      expect(s3Key.getAuth0UserIdFromAvatarKey(s3UploadedKey)).toEqual(expected)
    }
  )

  test('wrong avatar upload directory', () => {
    expect(() =>
      s3Key.getAuth0UserIdFromAvatarKey('kissa koira.jpg')
    ).toThrowError(/Illegal S3 Key for avatar/)

    expect(() =>
      s3Key.getAuth0UserIdFromAvatarKey(
        `${s3Key.DIRECTORY_AVATAR_UPLOADS}/123.jpeg`
      )
    ).toThrowError(/Illegal S3 Key for avatar/)

    expect(() =>
      s3Key.getAuth0UserIdFromAvatarKey(
        `${s3Key.DIRECTORY_AVATARS}/tmp/koira.jpeg`
      )
    ).toThrowError(/Illegal S3 Key for avatar/)

    expect(() =>
      s3Key.getAuth0UserIdFromAvatarKey(
        `${s3Key.DIRECTORY_AVATARS}/avatar.jpeg`
      )
    ).toThrowError(/Illegal S3 Key for avatar/)
  })
})
