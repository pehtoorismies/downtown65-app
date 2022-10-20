import type { AppSyncResolverHandler } from 'aws-lambda'
import type { AppSyncIdentityOIDC } from 'aws-lambda/trigger/appsync-resolver'
import { getPrimaryKey } from '../../core/event-primary-key'
import type { MutationLeaveEventArgs } from '~/appsync.gen'
import { getTable } from '~/dynamo/table'

type Claims = {
  sub: string
  aud: string[]
  azp: string
  scope: string
  iss: string
  ['https://graphql.downtown65.com/nickname']: string
  exp: number
  iat: number
  gty: string
}

export const leaveEvent: AppSyncResolverHandler<
  MutationLeaveEventArgs,
  boolean | undefined
> = async (event) => {
  const eventId = event.arguments.eventId
  const identity = event.identity as AppSyncIdentityOIDC

  const claims = identity.claims as Claims

  const nickname = claims['https://graphql.downtown65.com/nickname']

  const Table = getTable()

  // HACK: until dynamo db tools supports custom transactions
  // use documentClient
  const documentClient = Table.DocumentClient
  if (!documentClient) {
    throw new Error('No Dynamo Document client')
  }

  await documentClient
    .transactWrite({
      TransactItems: [
        {
          Delete: {
            TableName: Table.name,
            Key: {
              PK: `EVENT#${eventId}`,
              SK: `USER#${nickname}`,
            },
            ConditionExpression: `attribute_exists(#PK)`,
            ExpressionAttributeNames: {
              '#PK': 'PK',
            },
          },
        },
        {
          Update: {
            TableName: Table.name,
            Key: getPrimaryKey(eventId),
            UpdateExpression: 'REMOVE #participants.#nickname',
            ExpressionAttributeNames: {
              '#participants': 'participants',
              '#nickname': nickname,
            },
          },
        },
      ],
    })
    .promise()

  return true
}
