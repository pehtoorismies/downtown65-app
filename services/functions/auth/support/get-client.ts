import { Config } from '@serverless-stack/node/config'
import { AuthenticationClient } from 'auth0'

export const getClient = () => {
  return new AuthenticationClient({
    domain: Config.AUTH_DOMAIN,
    clientId: Config.AUTH_CLIENT_ID,
    clientSecret: Config.AUTH_CLIENT_SECRET,
  })
}
