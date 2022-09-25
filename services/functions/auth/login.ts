import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import jsonBodyParser from '@middy/http-json-body-parser'
import validator from '@middy/validator'

import { Config } from '@serverless-stack/node/config'
import { JSONSchemaType } from 'ajv'
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { getClient } from '../support/auth'
import { successResponse } from '../support/response'

const auth0 = getClient()

type LoginInput = {
  email: string
  password: string
}

interface BodyInput {
  body: LoginInput
}

const eventSchema: JSONSchemaType<BodyInput> = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  },
  required: ['body'],
}

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const { email, password } = event.body as unknown as LoginInput

  const authZeroUser = await auth0.passwordGrant({
    password,
    username: email,
    scope:
      'read:events write:events read:me write:me read:users openid profile',
    audience: Config.JWT_AUDIENCE,
  })

  return successResponse({
    accessToken: authZeroUser.access_token,
    idToken: authZeroUser.id_token,
    expiresIn: authZeroUser.expires_in,
  })
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
