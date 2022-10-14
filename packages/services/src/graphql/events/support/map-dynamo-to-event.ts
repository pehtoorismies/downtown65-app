import { z } from 'zod'
import type { Event, EventType } from '~/appsync.gen'

const DynamoDt65Event = z.object({
  created: z.string(),
  createdBy: z.string(),
  entity: z.literal('Dt65Event'),
  id: z.string(),
  dateStart: z.string(),
  modified: z.string(),
  participants: z.record(z.string()),
  race: z.boolean(),
  title: z.string(),
  type: z.string(), // should be enum
  subtitle: z.string().optional(),
})

export const mapDynamoToEvent = (dynamoItem: unknown): Event => {
  const parsed = DynamoDt65Event.parse(dynamoItem)

  return {
    ...parsed,
    type: parsed.type as EventType, // should check for enum
    participants: Object.entries(parsed.participants).map(
      ([nick, joinedAt]) => {
        return {
          nick,
          joinedAt,
        }
      }
    ),
  }
}
