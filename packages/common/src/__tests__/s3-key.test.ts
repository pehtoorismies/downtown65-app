import { expect, test } from 'vitest'
import { s3UserIdToAuth0, auth0ToS3UserId } from '../s3-key'

test.each([
  { input: 'auth3245' },
  {
    input: 'auth|3245',
  },
  {
    input: '324234235',
  },
  {
    input: 'auth0_',
  },
  {
    input: 'auth0_asdfasfd',
  },
])('s3UserIdToAuth0($input) -> $expected', ({ input }) => {
  expect(() => s3UserIdToAuth0(input)).toThrowError(/S3UserId is incorrect/)
})

test.each([{ input: 'auth3245' }])(
  's3UserIdToAuth0($input) -> $expected',
  ({ input }) => {
    expect(() => auth0ToS3UserId(input)).toThrowError(
      /Auth0UserId is incorrect/
    )
  }
)
