import type { AppSyncResolverHandler } from 'aws-lambda'
import type { Outputs as PrivateOut, Inputs as PrivateIn } from './private'
import { isPrivateField, privateResolver } from './private'
import type { Outputs as PublicOut, Inputs as PublicIn } from './public'
import { isPublicField, publicResolver } from './public'

export type EmptyArgs = Record<string, never>

type Inputs = PrivateIn & PublicIn
type Outputs = PrivateOut | PublicOut

export const main: AppSyncResolverHandler<Inputs, Outputs> = (
  event,
  context,
  callback
) => {
  const { fieldName } = event.info
  if (isPrivateField(fieldName)) {
    return privateResolver(fieldName)(event, context, callback)
  }
  if (isPublicField(fieldName)) {
    return publicResolver(fieldName)(event, context, callback)
  }
  throw new Error('Mismatch in schema and implementation')
}
