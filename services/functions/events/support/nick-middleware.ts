import middy from '@middy/core'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import jwtDecode from 'jwt-decode'
import { HttpRequestError } from '../../support/errors'

export type NickContext = { extras: { nickname: string } }

export const isNickContext = (object: unknown): object is NickContext => {
  const nick = (object as NickContext)['extras']['nickname']
  return !!nick
}

const NICK_PROPERTY = 'https://graphql.downtown65.com/nickname'

interface Dt65JwtToken {
  [NICK_PROPERTY]: string
}

const isDt65JwtToken = (object: unknown): object is Dt65JwtToken => {
  const nick = (object as Dt65JwtToken)[NICK_PROPERTY]
  return !!nick
}

const getNickname = (accessToken: string | undefined): string | undefined => {
  if (!accessToken) {
    return undefined
  }

  const token = jwtDecode(accessToken)
  if (isDt65JwtToken(token)) {
    return token[NICK_PROPERTY]
  }

  return undefined
}

const before: middy.MiddlewareFn<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = (request): void => {
  const nickname = getNickname(request.event.headers['authorization'])

  if (!nickname) {
    throw new HttpRequestError(
      500,
      JSON.stringify({
        message:
          'Misconfiguration error. Api end point should have jwt token with nickname',
      })
    )
  }

  const nickContext: NickContext = { extras: { nickname } }

  Object.assign(request.context, nickContext, request)

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
