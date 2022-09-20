import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'
import formatISO from 'date-fns/formatISO'
import { v4 as uuidv4 } from 'uuid'
import { getTable } from './db/table'
import { getPrimaryKey } from './support/event-primary-key'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
  successResponse,
} from './support/response'

interface AWSError {
  name: string
}

const isAWSError = (object: unknown): object is AWSError => {
  return typeof object === 'object' && object !== null && 'name' in object
}

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return badRequestResponse({ error: 'Missing eventId' })
  }

  const Table = getTable()

  const nick = `lepakko${uuidv4().slice(0, 4)}`

  const createdAt = formatISO(new Date())

  try {
    const result = await Table.transactWrite(
      [
        Table.Participant.putTransaction({
          PK: `EVENT#${eventId}`,
          SK: `USER#${nick}`,
          nick,
          GSI2PK: `USER#${nick}`,
          GSI2SK: `EVENT#${eventId}`,
        }),
        Table.Dt65Event.updateTransaction(
          {
            ...getPrimaryKey(eventId),
            participants: {
              $set: {
                [nick]: createdAt,
              },
            },
          },
          { conditions: { attr: 'title', exists: true } }
        ),
      ],
      {
        capacity: 'total',
        metrics: 'size',
      }
    )
    console.log(result)

    return successResponse({ response: 'success' })
  } catch (error: unknown) {
    if (isAWSError(error) && error.name === 'ConditionalCheckFailedException') {
      return notFoundResponse({ message: 'Event not found' })
    }
    //
    console.error(error)
    return internalErrorResponse({ message: 'Joining unsuccessful' })
  }
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
