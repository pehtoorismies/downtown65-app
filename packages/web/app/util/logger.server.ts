import pino from 'pino'
import { pinoLambdaDestination } from 'pino-lambda'
import pretty from 'pino-pretty'

// TODO: Bug process.env.IS_LOCAL is not set for Remix
// https://docs.sst.dev/constructs/Function#using-is_local-environment-variable

export const logger =
  process.env.NODE_ENV === 'development'
    ? pino(
        { level: 'trace' },
        pretty({
          colorize: true,
        })
      )
    : pino({ level: 'info' }, pinoLambdaDestination())
