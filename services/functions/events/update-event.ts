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
import { getTable } from '../db/table'
import { EVENT_TYPES, EventType } from '../support/event-type'
import { badRequestResponse, createdResponse } from '../support/response'
import { getPrimaryKey } from './support/event-primary-key'
import { jwtContextMiddleware } from './support/jwt-context-middleware'
import { scopeMiddleware } from './support/scope-middleware'

interface EventInput {
  dateStart?: string
  race?: boolean
  subtitle?: string
  title?: string
  type?: EventType
}

const eventSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
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

const getUpdateObject = (
  input: EventInput,
  eventId: string
): EventInput & { GSI1SK?: string } => {
  if (input.dateStart) {
    const dateStart = formatISO(new Date(input.dateStart))
    return {
      ...input,
      dateStart,
      GSI1SK: `DATE#${dateStart}#${eventId.slice(0, 8)}`,
    }
  }

  return input
}

const pickUpdateProperties = ({
  dateStart,
  race,
  subtitle,
  title,
  type,
}: EventInput) => ({
  dateStart,
  race,
  subtitle,
  title,
  type,
})

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return badRequestResponse({ error: 'Missing eventId' })
  }

  const input = event.body as unknown as EventInput

  if (Object.keys(input).length === 0) {
    return badRequestResponse({ error: 'No fields to update' })
  }

  const updated = getUpdateObject(pickUpdateProperties(input), eventId)

  const Table = getTable()

  await Table.Dt65Event.update({
    ...getPrimaryKey(eventId),
    ...updated,
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
