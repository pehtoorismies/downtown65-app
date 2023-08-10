import { AuthenticationClient, ManagementClient } from 'auth0'
import { Config } from 'sst/node/config'

export const getClient = () => {
  return new AuthenticationClient({
    domain: Config.AUTH_DOMAIN,
    clientId: Config.AUTH_CLIENT_ID,
    clientSecret: Config.AUTH_CLIENT_SECRET,
  })
}

export const getAuth0Management = async () => {
  const client = await getClient().clientCredentialsGrant({
    audience: `https://${Config.AUTH_DOMAIN}/api/v2/`,
    scope: 'read:users update:users',
  })
  const management = new ManagementClient({
    token: client.access_token,
    domain: Config.AUTH_DOMAIN,
  })
  return management
}
