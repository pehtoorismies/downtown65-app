import { SignupField } from '@downtown65-app/graphql/appsync.gen'
import type {
  FieldError,
  MutationSignupArgs,
  SignupPayload,
} from '@downtown65-app/graphql/appsync.gen'
import type { AppSyncResolverHandler } from 'aws-lambda'
import * as EmailValidator from 'email-validator'
import { Config } from 'sst/node/config'
import { Auth0UserResponse, toUser } from '../support/auth0-user'
import { ErrorResponse } from '~/gql/auth/support/error'
import { getAuth0Management } from '~/gql/support/auth0'

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

  if (errors.length > 0) {
    return { errors }
  }

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
        path: SignupField.Email,
      })
    }
    if (existingUsers[0].nickname === input.nickname) {
      errors.push({
        message: 'Nickname already exists',
        path: SignupField.Nickname,
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
    console.error(JSON.stringify(error))
    const errorResponse = ErrorResponse.parse(error)

    return {
      errors: [
        {
          message: errorResponse.message,
          path: SignupField.Email,
        },
      ],
    }
  }
}
