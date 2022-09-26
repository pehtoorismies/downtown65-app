import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { isDt65Context } from '../events/support/dt65-context'
import { jwtContextMiddleware } from '../events/support/jwt-context-middleware'
import { scopeMiddleware } from '../events/support/scope-middleware'
import { getAuth0Management } from '../support/auth'
import {
  badRequestResponse,
  internalErrorResponse,
  successResponse,
  unauthorizedRequestResponse,
} from '../support/response'
//
// interface Auth0User {
//   email: string
//   email_verified: boolean
//   name: string
//   nickname: string
//   picture: string
//   user_id: string
//   app_metadata: {
//     role: 'USER' | 'ADMIN'
//   }
//   user_metadata: {
//     username: string
//     subscribeEventCreationEmail: boolean
//     subscribeWeeklyEmail: boolean
//   }
// }

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (
  event,
  context
) => {
  const auth0Sub = event?.pathParameters?.id

  if (auth0Sub === undefined) {
    return badRequestResponse({ error: 'Missing eventId' })
  }

  if (!isDt65Context(context)) {
    return internalErrorResponse({
      error: 'Middleware context has incorrect configuration',
    })
  }
  if (auth0Sub !== context.extras.sub) {
    return unauthorizedRequestResponse({
      message: 'You can only query your own profile',
    })
  }

  // me
  const management = await getAuth0Management()
  const user = await management.getUser({ id: auth0Sub })
  // return successResponse({
  //   id: auth0Sub,
  //   name: user.name,
  //   nickname: user.nickname,
  //   email: user.email,
  //   preferences: {
  //     subscribeWeeklyEmail: user.user_metadata?['subscribeWeeklyEmail']
  //     // subscribeEventCreationEmail: user.user_metadata?['subscribeEventCreationEmail'],
  //   },
  // })
  return successResponse(user)
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jwtContextMiddleware())
  .use(scopeMiddleware({ scopes: ['read:me'] }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
