import { getEnvironmentVariable } from '@downtown65-app/util'

export const Config = {
  API_URL: getEnvironmentVariable('API_URL'),
  API_KEY: getEnvironmentVariable('API_KEY'),
  APP_STAGE: getEnvironmentVariable('APP_STAGE'),
  DOMAIN_NAME: getEnvironmentVariable('DOMAIN_NAME'),
  STORAGE_BUCKET: getEnvironmentVariable('STORAGE_BUCKET'),
  // MEDIA_DOMAIN: getEnvironmentVariable('MEDIA_DOMAIN'),
}
