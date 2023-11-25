import { DynamoDatetime } from '@downtown65-app/core/dynamo-datetime'
import type { CreateChallengeInput } from '@downtown65-app/graphql/graphql'
import { endOfMonth, startOfMonth } from 'date-fns'
import type { ZodError } from 'zod'
import { z } from 'zod'
import type { User } from '~/domain/user'
import { DateObject } from '~/routes-common/form-object'

const ChallengeInputForm = z.object({
  description: z.string().optional(),
  subtitle: z.string(),
  title: z.string().min(2),
})

const createMonthRange = (date: DateObject) => {
  const value = DynamoDatetime.fromComponents(date).getDateObject()

  return {
    dateStart: DynamoDatetime.fromDate(startOfMonth(value)).dateComponents,
    dateEnd: DynamoDatetime.fromDate(endOfMonth(value)).dateComponents,
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
  const maybeDate = DateObject.safeParse({
    year: body.get('year'),
    month: body.get('month'),
    day: body.get('day'),
  })

  const maybeInfo = ChallengeInputForm.safeParse({
    title: body.get('title'),
    subtitle: body.get('subtitle'),
    description: body.get('description'),
  })

  if (!maybeDate.success) {
    return { error: maybeDate.error, kind: 'error' }
  }
  if (!maybeInfo.success) {
    return {
      error: maybeInfo.error,
      kind: 'error',
    }
  }

  const dateRange = createMonthRange(maybeDate.data)

  return {
    kind: 'success',
    challengeInputForm: {
      ...maybeInfo.data,
      createdBy,
      dateStart: dateRange.dateStart,
      dateEnd: dateRange.dateEnd,
    },
  }
}
