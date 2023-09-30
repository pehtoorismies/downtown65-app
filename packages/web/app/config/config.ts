import { getEnvironmentVariable } from '@downtown65-app/core/get-environment-variable'

export const Config = {
  API_URL: getEnvironmentVariable('API_URL'),
  API_KEY: getEnvironmentVariable('API_KEY'),
  SST_STAGE: getEnvironmentVariable('SST_STAGE'),
  DOMAIN_NAME: getEnvironmentVariable('DOMAIN_NAME'),
  COOKIE_SECRET: getEnvironmentVariable('COOKIE_SECRET'),
  STORAGE_BUCKET: getEnvironmentVariable('STORAGE_BUCKET'),
  // MEDIA_DOMAIN: getEnvironmentVariable('MEDIA_DOMAIN'),
}
