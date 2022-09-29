import type middy from '@middy/core'
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'
import { matchScopes } from '../../../graphql/support/match-scopes'
import { HttpRequestError } from '../../support/errors'
import { isDt65Context } from './dt65-context'

interface Options {
  scopes: string[]
}

export const scopeMiddleware = (options: Options) => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
  > = (request): void => {
    const { context } = request

    if (!isDt65Context(context)) {
      throw new HttpRequestError(
        500,
        JSON.stringify({
          message:
            'Misconfiguration error. Api end point should have jwt token with scope and nickname',
        })
      )
    }

    const { scopes } = options

    const scopeMatcher = matchScopes(scopes)
    if (!scopeMatcher(context.extras.scope)) {
      throw new HttpRequestError(
        401,
        JSON.stringify({
          message: `Scope mismatch. Needed scopes: ${scopes}`,
        })
      )
    }
  }

  return {
    before,
  }
}
