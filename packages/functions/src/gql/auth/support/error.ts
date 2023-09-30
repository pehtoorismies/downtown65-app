import { z } from 'zod'

export const ErrorResponse = z.object({
  name: z.string(),
  message: z.string(),
  statusCode: z.number(),
})

export const ErrorMessage = z.object({
  error: z.string(),
  error_description: z.string(),
})
