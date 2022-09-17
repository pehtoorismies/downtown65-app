import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'

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

const eventCreator = (tableName: string) => async (input: EventInput) => {
  const uuid = uuidv4()

  const params = {
    // Get the table name from the environment variable
    TableName: tableName,
    Item: {
      PK: `EVENT#${uuid}`,
      SK: `EVENT#${uuid}`,
      GSI1PK: `EVENT#FUTURE`,
      GSI1SK: `DATE#${input.dateStart}#${uuid.substring(0, 8)}`,
      createdAt: `${new Date().toDateString()}`,
      createdBy: input.createdBy,
      dateStart: input.dateStart,
      title: input.title,
    },
  }

  await dynamoDb.put(params).promise()

  return params.Item
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
  const retValue = await createEvent(data)
  return {
    statusCode: 200,
    body: JSON.stringify(retValue),
  }
}
