import { z } from 'zod'

export const User = z.object({
  nickname: z.string(),
  id: z.string(),
  picture: z.string(),
})

export type User = z.infer<typeof User>

export type ChallengeParticipant = {
  id: string
  nickname: string
  picture: string
  doneDatesCount: number
}
