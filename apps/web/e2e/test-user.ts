import { getEnvironmentVariable } from '@downtown65-app/util/get-environment-variable'

export const testUser = {
  email: getEnvironmentVariable('TEST_USER_EMAIL'),
  password: getEnvironmentVariable('TEST_USER_PASSWORD'),
  nick: getEnvironmentVariable('TEST_USER_NICK'),
  registerSecret: getEnvironmentVariable('REGISTER_SECRET'),
}
