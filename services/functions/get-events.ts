import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { getDtEventEntity } from './support/dao'
import { successResponse } from './support/success-response'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async () => {
  const { DtEvent } = getDtEventEntity()

  const results = await DtEvent.query(`EVENT#FUTURE`, {
    index: 'GSI1',
  })

  return successResponse(results.Items)
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
