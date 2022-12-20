import * as process from 'node:process'
import { getEnvironmentVariable } from '@downtown65-app/common'
import type {
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
} from 'aws-lambda/trigger/dynamodb-stream'
import { createEventAddedEmail } from '~/email/create-event-added-email'
import { EmailableEvent } from '~/email/emailable-event'
import { sendEmail } from '~/email/send-email'
import { getAuth0Management } from '~/graphql/support/auth0'

const TEST_RECIPIENTS = ['dt65eventstest@mailinator.com']

const fetchCreateEventSubscribers = async (): Promise<string[]> => {
  const management = await getAuth0Management()
  try {
    const users = await management.getUsers({
      fields: 'email,name',
      search_engine: 'v3',
      q: `user_metadata.subscribeEventCreationEmail:true`,
    })

    return users.map(({ email }) => email).filter(Boolean) as string[]
  } catch (error) {
    console.error(error)
    return []
  }
}

const isTestEmail = (stage: string): boolean => {
  if (process.env.IS_LOCAL) {
    return true
  }
  return stage !== 'production'
}

export const main: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
): Promise<void> => {
  const stage = getEnvironmentVariable('SST_STAGE')
  const domainName = getEnvironmentVariable('DOMAIN_NAME')

  const imageOrigin = process.env.IS_LOCAL
    ? 'https://downtown65.events'
    : `https://${domainName}`

  const hrefOrigin = process.env.IS_LOCAL
    ? 'http://localhost:3000'
    : `https://${domainName}`

  const recipients = isTestEmail(stage)
    ? TEST_RECIPIENTS
    : await fetchCreateEventSubscribers()

  const createdRecord = event.Records[0]

  const params = EmailableEvent.parse(createdRecord)

  const body = createEventAddedEmail({
    ...params,
    eventImageUrl: `${imageOrigin}${params.eventImagePath}`,
    eventUrl: `${hrefOrigin}/events/${params.eventId}`,
    preferencesUrl: `${hrefOrigin}/profile`,
  })

  await sendEmail({
    subject: `Uusi tapahtuma: ${params.title}`,
    body: {
      text: body.plain,
      html: body.html,
    },
    from: 'Kyttaki <noreply@downtown65.events>',
    recipients,
  })

  if (!createdRecord) {
    console.error('Stream error, event not found')
  }
}
