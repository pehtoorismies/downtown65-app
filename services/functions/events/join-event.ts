import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'
import formatISO from 'date-fns/formatISO'
import { getTable } from '../db/table'
import { isAWSError } from '../support/aws-error'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
  successResponse,
} from '../support/response'
import { getPrimaryKey } from './support/event-primary-key'
import { nickMiddleware } from './support/nick-middleware'

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (
  event,
  context
) => {
  const eventId = event?.pathParameters?.id

  if (eventId === undefined) {
    return badRequestResponse({ error: 'Missing eventId' })
  }

  const Table = getTable()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nick = context.extras.nick

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
                [nick]: formatISO(new Date()),
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
  .use(nickMiddleware())
  .use(httpErrorHandler())
  .handler(lambdaHandler)
