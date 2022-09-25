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

import { getAuth0Management } from '../support/auth'
import { badRequestResponse, successResponse } from '../support/response'

type SignupInput = {
  email: string
  name: string
  nickname: string
  password: string
  registerSecret: string
}

interface BodyInput {
  body: SignupInput
}

const eventSchema: JSONSchemaType<BodyInput> = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      required: ['email', 'password', 'name', 'nickname', 'registerSecret'],
      properties: {
        email: { type: 'string' },
        name: { type: 'string' },
        nickname: { type: 'string' },
        password: { type: 'string' },
        registerSecret: { type: 'string' },
      },
    },
  },
  required: ['body'],
}

export const lambdaHandler: APIGatewayProxyHandlerV2 = async (event) => {
  const { email, password, name, registerSecret, nickname } =
    event.body as unknown as SignupInput

  if (registerSecret !== Config.REGISTER_SECRET) {
    return badRequestResponse({ message: 'Invalid register secret' })
  }

  const user = {
    email,
    password,
    name,
    nickname,
  }

  const management = await getAuth0Management()
  const auth0User = await management.createUser({
    connection: 'Username-Password-Authentication',
    ...user,
    verify_email: true,
    email_verified: false,
    user_metadata: {
      subscribeWeeklyEmail: true,
      subscribeEventCreationEmail: true,
    },
    app_metadata: { role: 'USER' },
  })

  return successResponse({
    id: auth0User.user_id,
    email: auth0User.email,
    name: auth0User.name,
    nickname: auth0User.nickname,
    username: auth0User.username,
    picture: auth0User.picture,
    updatedAt: auth0User.updated_at,
    createdAt: auth0User.created_at,
    preferences: auth0User.user_metadata,
  })
}

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResultV2>()
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(validator({ eventSchema }))
  .use(httpErrorHandler())
  .handler(lambdaHandler)
