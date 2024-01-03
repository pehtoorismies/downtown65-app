import { toISODate } from '@downtown65-app/core/event-time'
import { z } from 'zod'
import type { ChallengeState } from '~/routes-common/challenges/create-edit/challenge-reducer'

export const StringDate = z.object({
  year: z.coerce.string(),
  month: z.coerce.string(),
  day: z.coerce.string(),
})

export const challengeStateToSubmittable = (state: ChallengeState) => {
  const result = toISODate(state.date)
  if (!result.success) {
    throw new Error(`Illegal date in state`)
  }

  return {
    date: result.data,
    subtitle: state.subtitle,
    title: state.title,
    description: state.description,
  }
}
