import type { AppSyncResolverHandler } from 'aws-lambda'
import * as ChallengeCore from '../../core/challenge'
import type {
  Challenge,
  QueryChallengesArgs,
} from '~/generated-types/graphql-types'

export const getChallenges: AppSyncResolverHandler<
  QueryChallengesArgs,
  Challenge[]
> = (event) => {
  return ChallengeCore.getAll(event.arguments.filter)
}
