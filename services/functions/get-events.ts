// import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

// const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
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

  return {
    statusCode: 200,
    body: 'events here',
  }
}
