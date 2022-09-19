import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import formatISO from 'date-fns/formatISO'
import { v4 as uuidv4 } from 'uuid'

import { Dt65Event } from './support/dt65-event'
import { itemToEvent } from './support/item-to-event'

const ajv = new Ajv()
addFormats(ajv, ['date-time'])

const dynamoDb = new DynamoDB.DocumentClient()

interface EventInput {
  title: string
  createdBy: string
  dateStart: string
}

const schema: JSONSchemaType<EventInput> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    createdBy: { type: 'string' },
    dateStart: { type: 'string', format: 'date-time' },
  },
  required: ['title', 'createdBy', 'dateStart'],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

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

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const tableName = process.env.tableName
  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Config error process.env.tableName' }),
    }
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No JSON body present' }),
    }
  }

  const data = JSON.parse(event.body)

  const valid = validate(data)

  if (!valid) {
    return {
      statusCode: 400,
      body: JSON.stringify(validate.errors),
    }
  }

  const createEvent = eventCreator(tableName)
  const createdEvent = await createEvent(data)

  return {
    statusCode: 200,
    body: JSON.stringify(createdEvent),
  }
}
