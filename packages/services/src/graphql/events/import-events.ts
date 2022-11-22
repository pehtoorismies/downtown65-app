import type { AppSyncResolverHandler } from 'aws-lambda'
import fetch from 'node-fetch'
import * as Event from '~/core/event'
import type { EmptyArgs } from '~/graphql/support/empty-args'
import { getImportedEvents } from '~/import-old/get-imported-events'

const importUrl =
  'https://storage.googleapis.com/downtown65/events/prod-events.json'

export const importEvents: AppSyncResolverHandler<
  EmptyArgs,
  string
> = async () => {
  const response = await fetch(importUrl)
  const body = await response.text()
  const oldEvents = getImportedEvents(body)

  await Event.importEvents(oldEvents)
  return 'success'
}
