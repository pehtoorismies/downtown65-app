import { z } from 'zod'

export const preprocessNumber = (a: unknown) => {
  return typeof a === 'string' ? Number.parseInt(a, 10) : undefined
}

export const DateObject = z.object({
  year: z.preprocess(preprocessNumber, z.number().positive().gte(2000)),
  month: z.preprocess(preprocessNumber, z.number().positive().lte(12)),
  day: z.preprocess(preprocessNumber, z.number().positive().lte(31)),
})

export type DateObject = z.infer<typeof DateObject>
