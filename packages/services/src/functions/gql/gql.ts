import type { AppSyncResolverHandler } from 'aws-lambda'
import pino from 'pino'
import type {
  Inputs as PrivateIn,
  Outputs as PrivateOut,
} from '~/graphql/private'
import { isPrivateField, privateResolver } from '~/graphql/private'
import type { Inputs as PublicIn, Outputs as PublicOut } from '~/graphql/public'
import { isPublicField, publicResolver } from '~/graphql/public'

const logger = pino({ level: 'debug' })

type Inputs = PrivateIn & PublicIn
type Outputs = PrivateOut | PublicOut

export const main: AppSyncResolverHandler<Inputs, Outputs> = (
  event,
  context,
  callback
) => {
  logger.info({ NODE_PATH: process.env.NODE_PATH }, 'Node path')

  const { fieldName } = event.info
  if (isPrivateField(fieldName)) {
    return privateResolver(fieldName)(event, context, callback)
  }
  if (isPublicField(fieldName)) {
    return publicResolver(fieldName)(event, context, callback)
  }
  throw new Error('Mismatch in schema and implementation')
}
