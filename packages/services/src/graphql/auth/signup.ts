import { Config } from '@serverless-stack/node/config'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as EmailValidator from 'email-validator'
import { Auth0UserResponse, toUser } from '../support/auth0-user'
import type {
  FieldError,
  MutationSignupArgs,
  SignupPayload,
} from '~/appsync.gen'
import { ErrorResponse } from '~/graphql/auth/support/error'
import { getAuth0Management } from '~/graphql/support/auth0'

const hasWhiteSpace = (s: string) => {
  return /\s/.test(s)
}

export const signup: AppSyncResolverHandler<
  MutationSignupArgs,
  SignupPayload
> = async (event) => {
  const { input } = event.arguments

  const errors: FieldError[] = []

  if (hasWhiteSpace(input.email)) {
    errors.push({
      message: 'White space characters. Please remove empty spaces.',
      path: 'email',
    })
  }
  if (hasWhiteSpace(input.nickname)) {
    errors.push({
      message: 'White space characters. Please remove empty spaces.',
      path: 'nickname',
    })
  }
  if (input.name.trim().length !== input.name.length) {
    errors.push({
      message:
        'White space characters. Please remove empty spaces after or before.',
      path: 'name',
    })
  }

  if (errors.length > 0) {
    return { errors }
  }

  if (input.registerSecret !== Config.REGISTER_SECRET) {
    errors.push({
      message: 'Wrong register secret',
      path: 'registerSecret',
    })
  }
  if (input.password.length < 8) {
    errors.push({
      message: 'Password too short',
      path: 'password',
    })
  }
  if (!EmailValidator.validate(input.email)) {
    errors.push({
      message: 'Email format is incorrect',
      path: 'email',
    })
  }

  if (errors.length > 0) {
    return { errors }
  }

  const management = await getAuth0Management()

  const existingUsers = await management.getUsers({
    fields: 'email,nickname',
    search_engine: 'v3',
    q: `email:"${input.email}" OR nickname:"${input.nickname}"`,
  })

  if (existingUsers.length > 0) {
    if (existingUsers[0].email === input.email) {
      errors.push({
        message: 'Email already exists',
        path: 'email',
      })
    }
    if (existingUsers[0].nickname === input.nickname) {
      errors.push({
        message: 'Nickname already exists',
        path: 'nickname',
      })
    }
    if (errors.length === 0) {
      console.error('Illegal state. Query results:', existingUsers)
      throw new Error(
        'Illegal state. Auth0 query returned matching users but they are not found.'
      )
    }
    return { errors }
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

    const auth0User = Auth0UserResponse.parse(returnObject)

    return { user: toUser(auth0User) }
  } catch (error: unknown) {
    console.error(error)
    const errorResponse = ErrorResponse.parse(error)

    return {
      errors: [
        {
          message: errorResponse.message,
          path: 'email',
        },
      ],
    }
  }
}
