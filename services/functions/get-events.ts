import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { getDtEventEntity } from './support/dao'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async () => {
  const { DtEvent } = getDtEventEntity()

  const results = await DtEvent.query(`EVENT#FUTURE`, {
    index: 'GSI1',
  })

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results.Items),
  }
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
