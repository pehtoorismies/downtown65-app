import type { Event } from '~/appsync.gen'
import { Dt65EventGetSchema } from '~/core/dynamo-schemas/dt65-event-schema'

export const mapDynamoToEvent = (persistedDynamoItem: unknown): Event => {
  const result = Dt65EventGetSchema.safeParse(persistedDynamoItem)

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
