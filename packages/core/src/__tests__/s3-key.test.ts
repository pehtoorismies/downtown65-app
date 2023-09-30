import { describe, expect, test } from 'vitest'
import { s3Key } from '../s3-key'

describe('createAvatarUploadKey', () => {
  test.each([
    {
      filename: 'kissa koira.jpg',
      uploaderAuth0UserId: 'auth0|123123',
      suffix: '123',
      expected: {
        key: 'uploads/avatars/auth0_123123/avatar-123.jpg',
        filename: 'avatar-123.jpg',
      },
    },
    {
      filename: 'kissa koira.jpeg',
      uploaderAuth0UserId: 'auth0|abc',
      suffix: 'asd',
      expected: {
        key: 'uploads/avatars/auth0_abc/avatar-asd.jpeg',
        filename: 'avatar-asd.jpeg',
      },
    },
    {
      filename: 'kissa koira.gif',
      uploaderAuth0UserId: 'auth0|abc',
      suffix: 'asd',
      expected: {
        key: 'uploads/avatars/auth0_abc/avatar-asd.gif',
        filename: 'avatar-asd.gif',
      },
    },
  ])(
    'createAvatarUploadKey($uploaderAuth0UserId) -> $expected',
    ({ filename, uploaderAuth0UserId, suffix, expected }) => {
      expect(
        s3Key.createAvatarUploadKey(filename, uploaderAuth0UserId, suffix)
      ).toMatchObject(expected)
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

describe('getAvatarResizeKeys', () => {
  test.each([
    {
      filename: 'avatar-123.gif',
      auth0UserId: 'auth0|321321',
      expected: {
        sourceKey: `uploads/avatars/auth0_321321/avatar-123.gif`,
        targetFilename: 'avatars/auth0_321321/avatar-123',
      },
    },
    {
      filename: 'avatar-321.jpg',
      auth0UserId: 'auth0|123123',
      expected: {
        sourceKey: 'uploads/avatars/auth0_123123/avatar-321.jpg',
        targetFilename: 'avatars/auth0_123123/avatar-321',
      },
    },
  ])(
    'createAvatarUploadKey($s3UploadedKey) -> $expected',
    ({ filename, auth0UserId, expected }) => {
      expect(s3Key.getAvatarResizeKeys(filename, auth0UserId)).toMatchObject(
        expected
      )
    }
  )

  test('wrong avatar upload directory', () => {
    expect(() =>
      s3Key.getAvatarResizeKeys('kissa koira.jpg', 'auth0|123')
    ).toThrowError(/Illegal file name/)

    expect(() =>
      s3Key.getAvatarResizeKeys(`uploades/123.jpeg`, 'auth0|123')
    ).toThrowError(/Illegal file name/)

    expect(() =>
      s3Key.getAvatarResizeKeys(
        `uploads/auth0_123/tmp/avatar-123.jpeg`,
        'auth0|123'
      )
    ).toThrowError(/Illegal file name/)

    expect(() =>
      s3Key.getAvatarResizeKeys(`avatar-123.jpeg`, 'auth0123')
    ).toThrowError(/Illegal Auth0 userId/)
  })
})
