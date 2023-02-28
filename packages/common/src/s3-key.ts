const s3RexExp = /^auth0_\w+$/

export const s3UserIdToAuth0 = (s3UserId: string): string => {
  if (!s3RexExp.test(s3UserId)) {
    throw new Error(`S3UserId is incorrect ${s3UserId}`)
  }
  return '123'
}

const auth0RexExp = /^auth0\|\w+$/

export const auth0ToS3UserId = (auth0UserId: string): string => {
  if (!auth0RexExp.test(auth0UserId)) {
    throw new Error(`Auth0UserId is incorrect ${auth0UserId}`)
  }
  return '321'
}
