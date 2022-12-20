import { getEnvironmentVariable } from '@downtown65-app/common'
import type { Stack, StackContext } from '@serverless-stack/resources'
import { Config } from '@serverless-stack/resources'

const createConfigFromEnvironment = (stack: Stack, name: string) => {
  const config = new Config.Parameter(stack, name, {
    value: getEnvironmentVariable(name),
  })
  return config
}

export const ConfigStack = ({ stack }: StackContext) => {
  return {
    AUTH_CLIENT_ID: createConfigFromEnvironment(stack, 'AUTH_CLIENT_ID'),
    AUTH_CLIENT_SECRET: new Config.Secret(stack, 'AUTH_CLIENT_SECRET'),
    AUTH_DOMAIN: createConfigFromEnvironment(stack, 'AUTH_DOMAIN'),
    JWT_AUDIENCE: createConfigFromEnvironment(stack, 'JWT_AUDIENCE'),
    REGISTER_SECRET: new Config.Secret(stack, 'REGISTER_SECRET'),
  }
}
