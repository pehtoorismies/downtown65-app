import { EventTime, ISODate } from '@downtown65-app/core/event-time'
import type { CreateChallengeInput } from '@downtown65-app/graphql/graphql'
import { endOfMonth, startOfMonth } from 'date-fns'
import type { ZodError } from 'zod'
import { z } from 'zod'
import type { User } from '~/domain/user'

const ChallengeInputForm = z.object({
  date: ISODate,
  description: z.string().optional(),
  subtitle: z.string(),
  title: z.string().min(2),
})

const createMonthRange = (date: ISODate) => {
  const value = EventTime.create(date).getDate()

  const start = startOfMonth(value)
  const end = endOfMonth(value)

  return {
    dateStart: start.toISOString().slice(0, 10),
    dateEnd: end.toISOString().slice(0, 10),
  }
}

type Success = {
  kind: 'success'
  challengeInputForm: CreateChallengeInput
}

type Error = {
  kind: 'error'
  error: ZodError
}

export const getChallengeInput = (
  body: FormData,
  createdBy: User
): Success | Error => {
  const challengeInput = ChallengeInputForm.safeParse({
    date: body.get('date'),
    title: body.get('title'),
    subtitle: body.get('subtitle'),
    description: body.get('description'),
  })

  if (!challengeInput.success) {
    return {
      error: challengeInput.error,
      kind: 'error',
    }
  }

  const dateRange = createMonthRange(challengeInput.data.date)

  return {
    kind: 'success',
    challengeInputForm: {
      ...challengeInput.data,
      createdBy,
      dateStart: dateRange.dateStart,
      dateEnd: dateRange.dateEnd,
    },
  }
}
