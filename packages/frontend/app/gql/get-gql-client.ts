import { GraphQLClient } from 'graphql-request'
import { getSdk } from '~/gql/types.gen'

const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment value 'process.env.${name}' is not set`)
  }
  return value
}

export const getGqlSdk = () => {
  const client = new GraphQLClient(getEnvironmentVariable('API_URL'))
  return getSdk(client)
}

export const getPublicAuthHeaders = () => {
  return {
    'x-api-key': getEnvironmentVariable('API_KEY'),
  }
}
