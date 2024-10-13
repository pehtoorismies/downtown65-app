import type { AppSyncResolverHandler } from 'aws-lambda'
import * as Core from '../../core/challenge'
import type {
  Challenge,
  QueryChallengeArgs,
} from '~/generated-types/graphql-types'

export const getChallengeById: AppSyncResolverHandler<
  QueryChallengeArgs,
  Challenge | null
> = (event) => {
  return Core.getById(event.arguments.id)
}
