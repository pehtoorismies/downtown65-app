import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { getTable } from '../db/table'
import { badRequestResponse, successResponse } from '../support/response'
import { getPrimaryKey } from './support/event-primary-key'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return badRequestResponse({ error: 'Missing eventId' })
  }

  const Table = getTable()

  const results = await Table.Dt65Event.delete(getPrimaryKey(eventId), {
    returnValues: 'ALL_OLD',
  })

  if (!results.Attributes) {
    return badRequestResponse({ error: 'Not found' })
  }

  return successResponse(results.Attributes)
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
