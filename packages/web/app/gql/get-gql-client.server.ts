import { getEnvironmentVariable } from '@downtown65-app/core/get-environment-variable'
import { getSdk } from '@downtown65-app/graphql/appsync.gen'
import { GraphQLClient } from 'graphql-request'

export const getGqlSdk = () => {
  const client = new GraphQLClient(getEnvironmentVariable('API_URL'))
  return getSdk(client)
}

export const getPublicAuthHeaders = () => {
  return {
    'x-api-key': getEnvironmentVariable('API_KEY'),
  }
}
