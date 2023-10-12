import { logger } from '@downtown65-app/core/logger/logger'
import { SignupField } from '@downtown65-app/graphql/graphql'
import type {
  MutationSignupArgs,
  SignupFieldError,
  SignupInput,
  SignupResponse,
} from '@downtown65-app/graphql/graphql'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as EmailValidator from 'email-validator'
import { Config } from 'sst/node/config'
import { Auth0UserResponse } from '../support/auth0-user'
import { ErrorResponse } from '~/gql/auth/support/error'
import { getAuth0Management } from '~/gql/support/auth0'

const hasWhiteSpace = (s: string) => {
  return /\s/.test(s)
}

const validateWhiteSpace = (input: SignupInput): SignupFieldError[] => {
  const errors = []

  if (hasWhiteSpace(input.email)) {
    errors.push({
      message: 'White space characters. Please remove empty spaces.',
      path: SignupField.Email,
    })
  }
  if (hasWhiteSpace(input.nickname)) {
    errors.push({
      message: 'White space characters. Please remove empty spaces.',
      path: SignupField.Nickname,
    })
  }
  if (input.name.trim().length !== input.name.length) {
    errors.push({
      message:
        'White space characters. Please remove empty spaces after or before.',
      path: SignupField.Name,
    })
  }

  return errors.map((error) => ({
    __typename: 'SignupFieldError',
    ...error,
  }))
}

const validateFields = (input: SignupInput): SignupFieldError[] => {
  const errors = []

  if (input.registerSecret !== Config.REGISTER_SECRET) {
    errors.push({
      message: 'Wrong register secret',
      path: SignupField.RegisterSecret,
    })
  }
  if (input.password.length < 8) {
    errors.push({
      message: 'Password too short',
      path: SignupField.Password,
    })
  }
  if (!EmailValidator.validate(input.email)) {
    errors.push({
      message: 'Email format is incorrect',
      path: SignupField.Email,
    })
  }

  return errors.map((error) => ({
    __typename: 'SignupFieldError',
    ...error,
  }))
}

export const signup: AppSyncResolverHandler<
  MutationSignupArgs,
  SignupResponse
> = async (event) => {
  const { input } = event.arguments

  const whiteSpaceErrors = validateWhiteSpace(input)
  if (whiteSpaceErrors.length > 0) {
    return { errors: whiteSpaceErrors, __typename: 'SignupError' }
  }

  const fieldErrors = validateFields(input)
  if (fieldErrors.length > 0) {
    return { errors: fieldErrors, __typename: 'SignupError' }
  }

  const management = await getAuth0Management()

  const errors = []
  const query = `email:"${input.email}" OR nickname:"${input.nickname}"`
  const matchingUsers = await management.getUsers({
    fields: 'email,nickname',
    search_engine: 'v3',
    q: query,
  })

  if (matchingUsers.length > 0) {
    if (matchingUsers[0].email === input.email) {
      errors.push({
        message: 'Email already exists',
        path: SignupField.Email,
      })
    }
    if (matchingUsers[0].nickname === input.nickname) {
      errors.push({
        message: 'Nickname already exists',
        path: SignupField.Nickname,
      })
    }
    if (errors.length === 0) {
      logger.error(
        matchingUsers,
        `No matching users found. Illegal state in signup. With query: ${query}`
      )
      throw new Error(
        'Illegal state. Auth0 query returned matching users but they are not found.'
      )
    }

    return {
      __typename: 'SignupError',
      errors: errors.map((error) => ({
        __typename: 'SignupFieldError',
        ...error,
      })),
    }
  }

  try {
    const returnObject = await management.createUser({
      connection: 'Username-Password-Authentication',
      email: input.email,
      password: input.password,
      name: input.name,
      nickname: input.nickname,
      verify_email: true,
      email_verified: false,
      // switch user_metadata and app_metadata
      user_metadata: {
        subscribeWeeklyEmail: true,
        subscribeEventCreationEmail: true,
      },
      app_metadata: { role: 'USER' },
    })

    // validate format
    const user = Auth0UserResponse.parse(returnObject)

    return {
      __typename: 'SignupSuccess',
      message: `Created user ${user.email}`,
    }
  } catch (error: unknown) {
    console.error(JSON.stringify(error))
    const errorResponse = ErrorResponse.parse(error)

    return {
      __typename: 'SignupError',
      errors: [
        {
          __typename: 'SignupFieldError',
          message: errorResponse.message,
          path: SignupField.Email,
        },
      ],
    }
  }
}
