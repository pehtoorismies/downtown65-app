import { getEnvironmentVariable } from '@downtown65-app/core/get-environment-variable'

export const testUser = {
  email: getEnvironmentVariable('USER_EMAIL'),
  password: getEnvironmentVariable('USER_PASSWORD'),
  nick: getEnvironmentVariable('USER_NICK'),
}
