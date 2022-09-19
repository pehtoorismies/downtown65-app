import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { getDtEventEntity } from './support/dao'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id' }),
    }
  }

  const { DtEvent } = getDtEventEntity()

  const results = await DtEvent.get({
    PK: `EVENT#${eventId}`,
    SK: `EVENT#${eventId}`,
  })

  if (!results.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results.Item),
    headers: { 'Content-Type': 'application/json' },
  }
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
