import jwtDecode from 'jwt-decode'
import { z } from 'zod'
import { User } from '~/domain/user'

const UserJwt = User.extend({
  exp: z.number(),
})

type UserValue = {
  kind: 'user'
  user: User
}

type TokenExpired = {
  kind: 'expired'
}

type JwtFormatError = {
  kind: 'error'
}

type UserReturnValue = UserValue | TokenExpired | JwtFormatError

export const parseIdToken = (idJwtToken: string): UserReturnValue => {
  try {
    const decoded = jwtDecode(idJwtToken)
    const { exp, ...user } = UserJwt.parse(decoded)
    const isExpired = Date.now() >= exp * 1000
    if (isExpired) {
      return {
        kind: 'expired',
      }
    }

    return {
      kind: 'user',
      user: {
        id: user.sub,
        ...user,
      },
    }
  } catch {
    return {
      kind: 'error',
    }
  }
}
