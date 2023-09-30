import pino from 'pino'
import { pinoLambdaDestination } from 'pino-lambda'
import pretty from 'pino-pretty'

export const logger = process.env.IS_LOCAL
  ? pino(
      { level: 'trace' },
      pretty({
        colorize: true,
      })
    )
  : pino({ level: 'info' }, pinoLambdaDestination())
