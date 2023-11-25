import type {
  IdPayload,
  MutationCreateChallengeArgs,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Challenge from '../core/challenge'

export const createChallenge: AppSyncResolverHandler<
  MutationCreateChallengeArgs,
  IdPayload
> = async (event) => {
  const { input: creatableChallenge } = event.arguments

  const id = await Challenge.create(creatableChallenge)
  return {
    __typename: 'IDPayload',
    id,
  }
}
