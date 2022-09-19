import middy from '@middy/core'

import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import jsonBodyParser from '@middy/http-json-body-parser'

import validator from '@middy/validator'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import formatISO from 'date-fns/formatISO'
import { v4 as uuidv4 } from 'uuid'

import { getDtEventEntity } from './support/dao'

interface EventInput {
  title: string
  createdBy: string
  dateStart: string
}

const eventSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string' },
        dateStart: { type: 'string', format: 'date-time' },
        createdBy: { type: 'string' },
      },
    },
  },
  required: ['body'],
}

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const { DtEvent } = getDtEventEntity()
  console.log('Data', event.body)
  const { title, dateStart, createdBy } = event.body as unknown as EventInput

  const input = {
    title,
    dateStart,
    createdBy,
  }

  const uuid = uuidv4()
  const startDate = formatISO(new Date(input.dateStart))

  const result = await DtEvent.put({
    // add keys
    PK: `EVENT#${uuid}`,
    SK: `EVENT#${uuid}`,
    GSI1PK: `EVENT#FUTURE`,
    GSI1SK: `DATE#${startDate}#${uuid.slice(0, 8)}`,
    // add props
    createdAt: formatISO(new Date()),
    createdBy: input.createdBy,
    dateStart: startDate,
    id: uuid,
    title: input.title,
  })

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  }
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
