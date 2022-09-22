import middy from '@middy/core'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

import { HttpRequestError } from '../../support/errors'

const before: middy.MiddlewareFn<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = (request): void => {
  const nick = request.event.headers['x-nick']

  if (!nick) {
    throw new HttpRequestError(
      422,
      JSON.stringify({ message: 'x-nick header missing' })
    )
  }

  Object.assign(request.context, { extras: { nick } }, request)

  return
}

export const nickMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> => {
  return {
    before,
  }
}
