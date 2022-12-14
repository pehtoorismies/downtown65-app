import { z } from 'zod'
import type { Event, EventType } from '~/appsync.gen'

const PersistedDynamoEvent = z.object({
  created: z.string(),
  createdBy: z.object({
    nickname: z.string(),
    id: z.string(),
    picture: z.string(),
  }),
  dateStart: z.string(),
  description: z.string().optional(),
  entity: z.literal('Dt65Event'),
  id: z.string(),
  location: z.string(),
  modified: z.string(),
  participants: z.record(
    z.object({
      nickname: z.string(),
      joinedAt: z.string(), // validate date
      id: z.string(),
      picture: z.string(),
    })
  ),
  race: z.boolean(),
  subtitle: z.string(),
  timeStart: z.string().optional(),
  title: z.string(),
  type: z.string(), // should be enum
  updated: z.string().optional(),
})

export const mapDynamoToEvent = (persistedDynamoItem: unknown): Event => {
  const result = PersistedDynamoEvent.safeParse(persistedDynamoItem)

  if (!result.success) {
    throw new Error(
      `Error in dynamo item: ${JSON.stringify(persistedDynamoItem)}. Error: ${
        result.error
      }`
    )
  }
  const parsed = result.data
  return {
    ...parsed,
    type: parsed.type as EventType, // should check for enum
    // eslint-disable-next-line no-unused-vars
    participants: Object.entries(parsed.participants)
      // eslint-disable-next-line no-unused-vars
      .map(([_, value]) => {
        return {
          ...value,
        }
      })
      .sort((a, b) => {
        if (a.joinedAt < b.joinedAt) {
          return -1
        }
        if (a.joinedAt > b.joinedAt) {
          return 1
        }
        return 0
      }),
  }
}
