import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { format } from 'date-fns'
import startOfToday from 'date-fns/startOfToday'
import { getTable } from '../db/table'
import { successResponse } from '../support/response'
import { jwtContextMiddleware } from './support/jwt-context-middleware'
import { scopeMiddleware } from './support/scope-middleware'

type Participants = {
  [name: string]: string
}

const getExpression = (d: Date) => {
  const lt = format(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    'yyyy-MM-dd'
  )
  return `DATE#${lt}`
}

const mapToArray = (participants: Participants) => {
  return Object.entries(participants).map(([key, value]) => {
    return {
      nickname: key,
      createdAt: value,
    }
  })
}

export const lambdaHandler: APIGatewayProxyHandlerV2 = async () => {
  const Table = getTable()

  const query = getExpression(startOfToday())

  const results = await Table.Dt65Event.query(`EVENT#FUTURE`, {
    index: 'GSI1',
    gt: query,
  })

  const events = results.Items.map((item: { participants: Participants }) => {
    return {
      ...item,
      participants: mapToArray(item.participants),
    }
  })

  return successResponse(events)
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jwtContextMiddleware())
  .use(scopeMiddleware({ scopes: ['read:events'] }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
