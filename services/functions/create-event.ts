import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'

const dynamoDb = new DynamoDB.DocumentClient()

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('proces')
  // console.log(process.env)
  console.log('/proces')

  if (!event) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No JSON body present' }),
    }
  }

  if (!process.env.tableName) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errpr: 'Config error process.env.tableName' }),
    }
  }

  const uuid = uuidv4()

  const dateStart = '2022-07-21T09:35:31.820Z'
  const title = 'Some title'
  const createdBy = 'Nurja'

  // const data = JSON.parse(event.body)
  const params = {
    // Get the table name from the environment variable
    TableName: process.env.tableName,
    Item: {
      PK: `EVENT#${uuid}`,
      SK: `EVENT#${uuid}`,
      GSI1PK: `EVENT#FUTURE`,
      GSI1SK: `DATE#${dateStart}#${uuid.substring(0, 8)}`,
      dateStart,
      title,
      createdBy,
      createdAt: `${new Date().toDateString()}`,
    },
  }
  await dynamoDb.put(params).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  }

  // const getParams = {
  //   // Get the table name from the environment variable
  //   TableName: process.env.tableName,
  //   // Get the row where the counter is called "hits"
  //   Key: {
  //     counter: "eventId",
  //   },
  // };
  // const results = await dynamoDb.get(getParams).promise();
  //
  // // If there is a row, then get the value of the
  // // column called "tally"
  // let count = results.Item ? results.Item.tally : 0;
  //
  // const putParams = {
  //   TableName: process.env.tableName,
  //   Key: {
  //     counter: "eventId",
  //   },
  //   // Update the "tally" column
  //   UpdateExpression: "SET tally = :count",
  //   ExpressionAttributeValues: {
  //     // Increase the count
  //     ":count": ++count,
  //   },
  // };
  // await dynamoDb.update(putParams).promise();
}
