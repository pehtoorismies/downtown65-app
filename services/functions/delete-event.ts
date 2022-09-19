import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { getDtEventEntity } from './support/dao'
import { getPrimaryKey } from './support/get-primary-key'
import { successResponse } from './support/success-response'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing eventId' }),
    }
  }

  const { DtEvent } = getDtEventEntity()

  const results = await DtEvent.delete(getPrimaryKey(eventId), {
    returnValues: 'ALL_OLD',
  })

  return successResponse(results.Attributes)
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
