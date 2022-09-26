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

import { getTable } from '../db/table'
import { EVENT_TYPES, EventType } from '../support/event-type'
import { createdResponse } from '../support/response'
import { getPrimaryKey } from './support/event-primary-key'
import { jwtContextMiddleware } from './support/jwt-context-middleware'
import { scopeMiddleware } from './support/scope-middleware'

interface EventInput {
  createdBy: string
  dateStart: string
  race: boolean
  subtitle?: string
  title: string
  type: EventType
}

const eventSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      required: ['title'],
      properties: {
        createdBy: { type: 'string' },
        dateStart: { type: 'string', format: 'date-time' },
        race: { type: 'boolean' },
        subtitle: { type: 'string' },
        title: { type: 'string' },
        type: { type: 'string', enum: EVENT_TYPES },
      },
    },
  },
  required: ['body'],
}

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const Table = getTable()
  const { title, dateStart, createdBy, type } =
    event.body as unknown as EventInput

  const eventId = uuidv4()
  const startDate = formatISO(new Date(dateStart))

  await Table.Dt65Event.put({
    // add keys
    ...getPrimaryKey(eventId),
    GSI1PK: `EVENT#FUTURE`,
    GSI1SK: `DATE#${startDate}#${eventId.slice(0, 8)}`,
    // add props
    createdBy,
    dateStart: startDate,
    id: eventId,
    title,
    participants: {},
    type,
  })

  return createdResponse({ id: eventId })
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(jwtContextMiddleware())
  .use(scopeMiddleware({ scopes: ['write:events'] }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
