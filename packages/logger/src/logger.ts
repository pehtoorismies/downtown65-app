import { getEnvironmentVariable } from '@downtown65-app/util'
import pino from 'pino'
import { pinoLambdaDestination } from 'pino-lambda'
import pretty from 'pino-pretty'

const destination = pinoLambdaDestination()

export const logger =
  getEnvironmentVariable('APP_MODE') === 'dev'
    ? pino(
        { level: 'trace' },
        pretty({
          colorize: true,
        })
      )
    : pino({ level: 'info' }, destination)
