import type { AppSyncResolverHandler } from 'aws-lambda'
import { isPrivateField, privateResolver } from './private'
import { isPublicField, publicResolver } from './public'

export type EmptyArgs = Record<string, never>

export const main: AppSyncResolverHandler = (event, context, callback) => {
  const { fieldName } = event.info
  if (isPrivateField(fieldName)) {
    return privateResolver(fieldName)(event, context, callback)
  }
  if (isPublicField(fieldName)) {
    return publicResolver(fieldName)(event, context, callback)
  }

  throw new Error('Mismatch in schema and implementation')
}
