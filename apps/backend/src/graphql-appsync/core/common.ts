import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { formatISO } from 'date-fns'
import {
  ParticipantsSchema,
  ParticipatingUserSchema,
} from '~/graphql-appsync/core/dynamo-schemas/common'

function isError(error: unknown): error is Error {
  return (error as Error).name !== undefined
}

interface Common {
  getPrimaryKey: (id: string) => {
    PK: string
    SK: string
  }
  tableName?: string
  documentClient: DynamoDBDocumentClient
}

export const getParticipationFunctions = ({
  documentClient,
  getPrimaryKey,
  tableName,
}: Common) => {
  return {
    participate: async (
      id: string,
      user: { nickname: string; id: string; picture: string }
    ) => {
      const participatingUser: ParticipatingUserSchema = {
        joinedAt: formatISO(new Date()).slice(0, 19),
        ...user,
      }

      const command = new UpdateCommand({
        Key: getPrimaryKey(id),
        TableName: tableName,
        UpdateExpression: 'SET #participants.#userId = :user',
        ConditionExpression: 'attribute_not_exists(#participants.#userId)',
        ExpressionAttributeNames: {
          '#participants': 'participants',
          '#userId': user.id,
        },
        ExpressionAttributeValues: {
          ':user': ParticipatingUserSchema.parse(participatingUser),
        },
      })

      try {
        await documentClient.send(command)
      } catch (error) {
        if (
          isError(error) &&
          error.name !== 'ConditionalCheckFailedException'
        ) {
          console.error(error)
        }
      }
    },
    leave: async (id: string, userId: string) => {
      const command = new UpdateCommand({
        Key: getPrimaryKey(id),
        TableName: tableName,
        UpdateExpression: 'REMOVE #participants.#userId',
        ConditionExpression: 'attribute_exists(#participants.#userId)',
        ExpressionAttributeNames: {
          '#participants': 'participants',
          '#userId': userId,
        },
      })

      try {
        await documentClient.send(command)
      } catch (error) {
        if (
          isError(error) &&
          error.name !== 'ConditionalCheckFailedException'
        ) {
          console.error(error)
        }
      }
    },
  }
}

export const participantHashMapToList = (participantsHashMap: unknown) => {
  const parsed = ParticipantsSchema.safeParse(participantsHashMap)
  if (!parsed.success) {
    throw new Error(
      `Error in dynamo item participants: ${JSON.stringify(
        participantsHashMap
      )}. Error: ${parsed.error}`
    )
  }

  return (
    Object.entries(parsed.data)
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
      })
  )
}
