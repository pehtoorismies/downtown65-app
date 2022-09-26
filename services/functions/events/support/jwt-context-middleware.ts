import middy from '@middy/core'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import jwtDecode from 'jwt-decode'
import { HttpRequestError } from '../../support/errors'
import { Dt65Context } from './dt65-context'

const NICK_PROPERTY = 'https://graphql.downtown65.com/nickname'

interface Dt65JwtToken {
  [NICK_PROPERTY]: string
  scope: string
  sub: string
}

const isDt65JwtToken = (object: unknown): object is Dt65JwtToken => {
  const token = object as Dt65JwtToken

  const nick = token[NICK_PROPERTY]
  const scope = token['scope']
  const sub = token['sub']

  if (!nick || !scope || !sub) {
    return false
  }

  return true
}

const getContext = (
  accessToken: string | undefined
): Dt65Context | undefined => {
  if (!accessToken) {
    return undefined
  }

  const token = jwtDecode(accessToken)
  if (isDt65JwtToken(token)) {
    return {
      extras: {
        nickname: token[NICK_PROPERTY],
        scope: token['scope'],
        sub: token['sub'],
      },
    }
  }

  return undefined
}

const before: middy.MiddlewareFn<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = (request): void => {
  const context = getContext(request.event.headers['authorization'])

  if (!context) {
    throw new HttpRequestError(
      500,
      JSON.stringify({
        message:
          'Misconfiguration error. Api end point should have jwt token with scope and nickname',
      })
    )
  }

  Object.assign(request.context, context, request)

  return
}

export const jwtContextMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> => {
  return {
    before,
  }
}
