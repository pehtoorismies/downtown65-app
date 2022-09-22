import { Config, StackContext } from '@serverless-stack/resources'

const getEnvironmentVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment value 'process.env.${name}' is not set`)
  }
  return value
}

export const ConfigStack = ({ stack }: StackContext) => {
  const AUTH_DOMAIN = new Config.Parameter(stack, 'AUTH_DOMAIN', {
    value: getEnvironmentVariable('AUTH_DOMAIN'),
  })

  const AUTH_CLIENT_ID = new Config.Parameter(stack, 'AUTH_CLIENT_ID', {
    value: getEnvironmentVariable('AUTH_CLIENT_ID'),
  })
  const JWT_AUDIENCE = new Config.Parameter(stack, 'JWT_AUDIENCE', {
    value: getEnvironmentVariable('JWT_AUDIENCE'),
  })

  const AUTH_CLIENT_SECRET = new Config.Secret(stack, 'AUTH_CLIENT_SECRET')
  const REGISTER_SECRET = new Config.Secret(stack, 'REGISTER_SECRET')

  return {
    AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET,
    AUTH_DOMAIN,
    JWT_AUDIENCE,
    REGISTER_SECRET,
  }
}
