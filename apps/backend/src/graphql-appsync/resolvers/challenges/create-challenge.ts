import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Challenge from '../../core/challenge'
import type {
  IdPayload,
  MutationCreateChallengeArgs,
} from '~/generated-types/graphql-types'

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
