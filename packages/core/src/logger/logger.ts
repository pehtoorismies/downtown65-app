import pino from 'pino'
import { pinoLambdaDestination } from 'pino-lambda'
import pretty from 'pino-pretty'
import { getEnvironmentVariable } from '~/get-environment-variable'

export const logger =
  getEnvironmentVariable('APP_MODE') === 'dev'
    ? pino(
        { level: 'trace' },
        pretty({
          colorize: true,
        })
      )
    : pino({ level: 'info' }, pinoLambdaDestination())
