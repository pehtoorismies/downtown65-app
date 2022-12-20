import { getEnvironmentVariable } from '@downtown65-app/common'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from '~/gql/types.gen'

export const getGqlSdk = () => {
  const client = new GraphQLClient(getEnvironmentVariable('API_URL'))
  return getSdk(client)
}

export const getPublicAuthHeaders = () => {
  return {
    'x-api-key': getEnvironmentVariable('API_KEY'),
  }
}
