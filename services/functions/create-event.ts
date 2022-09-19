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

import { DynamoDB } from 'aws-sdk'
import formatISO from 'date-fns/formatISO'
import { v4 as uuidv4 } from 'uuid'

import { Dt65Event } from './support/dt65-event'
import { itemToEvent } from './support/item-to-event'

const dynamoDb = new DynamoDB.DocumentClient()

interface EventInput {
  title: string
  createdBy: string
  dateStart: string
}

const eventSchema = {
  input: {
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
  },
}

const eventCreator =
  (tableName: string) =>
  async (input: EventInput): Promise<Dt65Event> => {
    const uuid = uuidv4()

    const startDate = formatISO(new Date(input.dateStart))

    const params = {
      // Get the table name from the environment variable
      TableName: tableName,
      Item: {
        // add keys
        PK: `EVENT#${uuid}`,
        SK: `EVENT#${uuid}`,
        GSI1PK: `EVENT#FUTURE`,
        GSI1SK: `DATE#${startDate}#${uuid.slice(0, 8)}`,
        // add props
        createdAt: formatISO(new Date()),
        createdBy: input.createdBy,
        dateStart: startDate,
        eventId: uuid,
        title: input.title,
      },
    }

    await dynamoDb.put(params).promise()

    const item = params.Item

    return itemToEvent(params.Item)
  }

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const tableName = process.env.tableName
  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Config error process.env.tableName' }),
    }
  }

  console.log('event.body')
  const { title, dateStart, createdBy } = event.body as unknown as EventInput

  const data = {
    title,
    dateStart,
    createdBy,
  }

  const createEvent = eventCreator(tableName)
  const createdEvent = await createEvent(data)

  return {
    statusCode: 200,
    body: JSON.stringify(createdEvent),
  }
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
