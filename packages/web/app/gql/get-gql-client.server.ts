import { getSdk } from '@downtown65-app/graphql/appsync.gen'
import { GraphQLClient } from 'graphql-request'
import { Config } from '~/config/config'

export const getGqlSdk = () => {
  const client = new GraphQLClient(Config.API_URL)
  return getSdk(client)
}

export const getPublicAuthHeaders = () => {
  return {
    'x-api-key': Config.API_KEY,
  }
}
