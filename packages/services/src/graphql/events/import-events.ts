import type { AppSyncResolverHandler } from 'aws-lambda'
import fetch from 'node-fetch'
import type { MutationImportEventsArgs } from '~/appsync.gen'
import * as Event from '~/core/event'
import { getImportedEvents } from '~/import-old/get-imported-events'

const importUrl =
  'https://storage.googleapis.com/downtown65/events/prod-events.txt'

export const importEvents: AppSyncResolverHandler<
  MutationImportEventsArgs,
  string
> = async (event) => {
  try {
    const { start, end } = event.arguments
    const response = await fetch(importUrl)

    const body = await response.text()
    // console.log(body.slice(0, 199))
    const oldEvents = getImportedEvents(body, start, end)

    await Event.importEvents(oldEvents)
    return 'success'
  } catch (error) {
    console.error(error)
    return 'unsuccessful'
  }
}
