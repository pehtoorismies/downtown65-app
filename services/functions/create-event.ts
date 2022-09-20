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

import { getTable } from './db/table'
import { getPrimaryKey } from './support/event-primary-key'
import { createdResponse } from './support/response'

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
  const Table = getTable()
  const { title, dateStart, createdBy } = event.body as unknown as EventInput

  const input = {
    title,
    dateStart,
    createdBy,
  }

  const eventId = uuidv4()
  const startDate = formatISO(new Date(input.dateStart))

  await Table.Dt65Event.put({
    // add keys
    ...getPrimaryKey(eventId),
    GSI1PK: `EVENT#FUTURE`,
    GSI1SK: `DATE#${startDate}#${eventId.slice(0, 8)}`,
    // add props
    createdAt: formatISO(new Date()),
    createdBy: input.createdBy,
    dateStart: startDate,
    id: eventId,
    title: input.title,
    participants: {},
  })

  return createdResponse({ id: eventId })
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
