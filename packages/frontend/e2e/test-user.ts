import { getEnvironmentVariable } from '@downtown65-app/common'

export const testUser = {
  email: getEnvironmentVariable('USER_EMAIL'),
  password: getEnvironmentVariable('USER_PASSWORD'),
  nick: getEnvironmentVariable('USER_NICK'),
}
