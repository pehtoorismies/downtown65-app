import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { getTable } from '../db/table'

import {
  badRequestResponse,
  internalErrorResponse,
  successResponse,
} from '../support/response'
import { isDt65Context } from './support/dt65-context'
import { getPrimaryKey } from './support/event-primary-key'
import { jwtContextMiddleware } from './support/jwt-context-middleware'
import { scopeMiddleware } from './support/scope-middleware'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (
  event,
  context
) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return badRequestResponse({ error: 'Missing eventId' })
  }

  if (!isDt65Context(context)) {
    return internalErrorResponse({
      error: 'Middleware context has incorrect configuration',
    })
  }

  const nick = context.extras.nickname

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
  .use(jwtContextMiddleware())
  .use(scopeMiddleware({ scopes: ['write:events'] }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
