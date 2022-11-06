import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import type { MutationParticipateEventArgs } from '~/appsync.gen'
import * as Event from '~/core/event'

type Claims = {
  sub: string
  aud: string[]
  azp: string
  scope: string
  iss: string
  ['https://graphql.downtown65.com/nickname']: string
  exp: number
  iat: number
  gty: string
}

export const participateEvent: AppSyncResolverHandler<
  MutationParticipateEventArgs,
  boolean | undefined
> = async (event) => {
  const { eventId, me } = event.arguments

  const identity = event.identity as AppSyncIdentityOIDC
  const claims = identity.claims as Claims

  if (claims.sub !== me.id) {
    throw new Error(
      'Trying to insert somebody else. You can only participate yourself.'
    )
  }

  const nickname = claims['https://graphql.downtown65.com/nickname']

  await Event.participate(eventId, {
    nickname,
    picture: 'temp',
    id: 'temp',
  })
  return true
}
