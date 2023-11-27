import type {
  Challenge,
  QueryChallengesArgs,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as ChallengeCore from '../core/challenge'

export const getChallenges: AppSyncResolverHandler<
  QueryChallengesArgs,
  Challenge[]
> = (event) => {
  return ChallengeCore.getAll(event.arguments.filter)
}
