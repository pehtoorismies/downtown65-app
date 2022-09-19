import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const tableName = process.env.tableName
  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Config error process.env.tableName' }),
    }
  }

  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id' }),
    }
  }

  const getParams = {
    TableName: tableName,
    Key: {
      PK: `EVENT#${eventId}`,
      SK: `EVENT#${eventId}`,
    },
    AttributesToGet: ['eventId', 'title', 'createdAt', 'createdBy'],
  }
  const results = await dynamoDb.get(getParams).promise()

  if (!results.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not found' }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results.Item),
    headers: { 'Content-Type': 'application/json' },
  }
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
