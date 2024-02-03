import { logger } from '@downtown65-app/logger'
import { SignupField } from '@downtown65-app/types'
import type {
  FieldError,
  MutationSignupArgs,
  SignupInput,
  SignupResponse,
} from '@downtown65-app/types'
import { AuthApiError } from 'auth0'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as EmailValidator from 'email-validator'
import { Config } from 'sst/node/config'
import { getAuth0Management } from '~/gql/support/auth0'

const hasWhiteSpace = (s: string) => {
  return /\s/.test(s)
}

const validateWhiteSpace = (input: SignupInput): FieldError[] => {
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

  if (input.name.split(' ').some((x) => x.length === 0)) {
    errors.push({
      message: 'White space characters. Please remove empty spaces.',
      path: SignupField.Name,
    })
  }

  return errors.map((error) => ({
    __typename: 'FieldError',
    ...error,
  }))
}

const validateFields = (input: SignupInput): FieldError[] => {
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
    __typename: 'FieldError',
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
    return { errors: whiteSpaceErrors, __typename: 'SignupFieldError' }
  }

  const fieldErrors = validateFields(input)
  if (fieldErrors.length > 0) {
    return { errors: fieldErrors, __typename: 'SignupFieldError' }
  }

  const auth0managementClient = await getAuth0Management()

  const errors = []
  const query = `email:"${input.email}" OR nickname:"${input.nickname}"`
  // TODO: add try catch
  const { data: matchingUsers } = await auth0managementClient.users.getAll({
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
      __typename: 'SignupFieldError',
      errors: errors.map((error) => ({
        __typename: 'FieldError',
        ...error,
      })),
    }
  }

  try {
    const { data } = await auth0managementClient.users.create({
      connection: 'Username-Password-Authentication',
      email: input.email,
      password: input.password,
      name: input.name,
      nickname: input.nickname,
      verify_email: true,
      email_verified: false,
      // TODO: switch user_metadata and app_metadata
      user_metadata: {
        subscribeWeeklyEmail: true,
        subscribeEventCreationEmail: true,
      },
      app_metadata: { role: 'USER' },
    })

    return {
      __typename: 'SignupSuccess',
      message: `Created user ${data.email}`,
    }
  } catch (error: unknown) {
    logger.error(error, 'Unexpected signup error')
    if (error instanceof AuthApiError) {
      return {
        __typename: 'SignupError',
        statusCode: error.statusCode,
        error: error.error,
        message: error.message,
      }
    }

    return {
      __typename: 'SignupError',
      statusCode: 500,
      error: 'unexpected_error',
      message: 'Unexpected error. Contact admin.',
    }
  }
}
