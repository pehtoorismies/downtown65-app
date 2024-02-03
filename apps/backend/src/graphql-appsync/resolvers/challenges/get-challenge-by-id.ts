import type { Challenge, QueryChallengeArgs } from '@downtown65-app/types'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Core from '../../core/challenge'

export const getChallengeById: AppSyncResolverHandler<
  QueryChallengeArgs,
  Challenge | null
> = (event) => {
  return Core.getById(event.arguments.id)
}
