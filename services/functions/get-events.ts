import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

const dynamoDb = new DynamoDB.DocumentClient()

export const main: APIGatewayProxyHandlerV2 = async () => {
  const tableName = process.env.tableName
  if (!tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Config error process.env.tableName' }),
    }
  }

  const queryParams = {
    TableName: tableName,
    IndexName: 'events',
    KeyConditionExpression: 'GSI1PK = :gsi1pk',
    ExpressionAttributeValues: {
      ':gsi1pk': 'EVENT#FUTURE',
    },
  }
  const results = await dynamoDb.query(queryParams).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  }
}
