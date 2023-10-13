import type { AppSyncResolverHandler } from 'aws-lambda'
import { lambdaRequestTracker } from 'pino-lambda'
import type { Inputs as PrivateIn, Outputs as PrivateOut } from './private'
import { isPrivateField, privateResolver } from './private'
import type { Inputs as PublicIn, Outputs as PublicOut } from './public'
import { isPublicField, publicResolver } from './public'

const withRequest = lambdaRequestTracker()

type Inputs = PrivateIn & PublicIn
type Outputs = PrivateOut | PublicOut

export const handler: AppSyncResolverHandler<Inputs, Outputs> = (
  event,
  context,
  callback
) => {
  withRequest(event, context)

  const { fieldName } = event.info
  if (isPrivateField(fieldName)) {
    return privateResolver(fieldName)(event, context, callback)
  }
  if (isPublicField(fieldName)) {
    return publicResolver(fieldName)(event, context, callback)
  }
  throw new Error('Mismatch in schema and implementation')
}
