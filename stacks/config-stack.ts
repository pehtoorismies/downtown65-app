import { Config } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'

type ConfigKey = 'AUTH_CLIENT_ID' | 'AUTH_DOMAIN' | 'JWT_AUDIENCE'
type AuthConfig = Record<ConfigKey, string>

const DEVELOPMENT: AuthConfig = {
  AUTH_CLIENT_ID: 'JaoAht7ggce7f5R8DCBGUyjUJeMQEDtz',
  AUTH_DOMAIN: 'dev-dt65.eu.auth0.com',
  JWT_AUDIENCE: 'https://graphql-dev.downtown65.com',
}

const PRODUCTION: AuthConfig = {
  AUTH_CLIENT_ID: 'uPu5NUyP1yaGw2IAC0B1KeCgbX3FaNzz',
  AUTH_DOMAIN: 'prod-dt65.eu.auth0.com',
  JWT_AUDIENCE: 'https://graphql-api.downtown65.com/',
}

export const ConfigStack = ({ app, stack }: StackContext) => {
  const authConfig = app.stage === 'production' ? PRODUCTION : DEVELOPMENT

  const getStaticConfig = (key: ConfigKey) =>
    new Config.Parameter(stack, key, {
      value: authConfig[key],
    })

  return {
    AUTH_CLIENT_ID: getStaticConfig('AUTH_CLIENT_ID'),
    // Auth0 Client Application secret
    AUTH_CLIENT_SECRET: new Config.Secret(stack, 'AUTH_CLIENT_SECRET'),
    AUTH_DOMAIN: getStaticConfig('AUTH_DOMAIN'),
    JWT_AUDIENCE: getStaticConfig('JWT_AUDIENCE'),
    // secret string required when user fills the form to register to downtown65.events
    REGISTER_SECRET: new Config.Secret(stack, 'REGISTER_SECRET'),
    // secret setting cookies in frontend
    COOKIE_SECRET: new Config.Secret(stack, 'COOKIE_SECRET'),
  }
}
