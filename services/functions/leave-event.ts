import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'
import formatISO from 'date-fns/formatISO'
import { v4 as uuidv4 } from 'uuid'
import { getTable } from './db/table'
import { isAWSError } from './support/aws-error'
import { getPrimaryKey } from './support/event-primary-key'
import { nickMiddleware } from './support/nick-middleware'
import { badRequestResponse, successResponse } from './support/response'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (
  event,
  context
) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return badRequestResponse({ error: 'Missing eventId' })
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nick = context.extras.nick

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
              SK: `USER#${nick}`,
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
            UpdateExpression: 'REMOVE #participants.#nick',
            ExpressionAttributeNames: {
              '#participants': 'participants',
              '#nick': nick,
            },
          },
        },
      ],
    })
    .promise()

  return successResponse({ response: 'success' })
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(nickMiddleware())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
