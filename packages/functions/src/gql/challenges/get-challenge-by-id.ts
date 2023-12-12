import type {
  DetailedChallenge,
  QueryChallengeArgs,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Core from '../core/challenge'

export const getChallengeById: AppSyncResolverHandler<
  QueryChallengeArgs,
  DetailedChallenge | null
> = (event) => {
  return Core.getById(event.arguments.id)
}
