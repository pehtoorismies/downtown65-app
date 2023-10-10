import { GraphQLClient } from 'graphql-request'
import { Config } from '~/config/config'

export const gqlClient = new GraphQLClient(Config.API_URL)

export const PUBLIC_AUTH_HEADERS = {
  'x-api-key': Config.API_KEY,
}
