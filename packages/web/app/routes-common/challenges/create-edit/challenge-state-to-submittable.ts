import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import { z } from 'zod'
import type { ChallengeState } from '~/routes-common/challenges/create-edit/challenge-reducer'

export const StringDate = z.object({
  year: z.coerce.string(),
  month: z.coerce.string(),
  day: z.coerce.string(),
})

export const challengeStateToSubmittable = (state: ChallengeState) => {
  const date = DynamoDatetime.fromDate(state.date).dateComponents

  return {
    ...StringDate.parse(date),
    subtitle: state.subtitle,
    title: state.title,
    description: state.description,
  }
}
