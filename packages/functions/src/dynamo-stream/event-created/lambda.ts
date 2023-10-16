import { createEventAddedEmail } from '@downtown65-app/core/email/create-event-added-email'
import { EmailableEvent } from '@downtown65-app/core/email/emailable-event'
import { sendEmail } from '@downtown65-app/core/email/send-email'
import { getEnvironmentVariable } from '@downtown65-app/core/get-environment-variable'
import type { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import { chunk } from 'remeda'
import { getAuth0Management } from '~/gql/support/auth0'

const TEST_RECIPIENTS = [
  'dt65eventstest@mailinator.com',
  'dt65eventstest2@mailinator.com',
  'dt65eventstest3@mailinator.com',
  'dt65eventstest4@mailinator.com',
]

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

const isTestEmail = (stage: string, appMode: string): boolean => {
  if (appMode === 'dev') {
    return true
  }
  return stage !== 'production'
}

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
): Promise<void> => {
  const stage = getEnvironmentVariable('APP_STAGE')
  const appMode = getEnvironmentVariable('APP_MODE')
  const domainName = getEnvironmentVariable('DOMAIN_NAME')

  const imageOrigin =
    appMode === 'dev' ? 'https://downtown65.events' : `https://${domainName}`

  const hrefOrigin =
    appMode === 'dev' ? 'http://localhost:3000' : `https://${domainName}`

  const recipients = isTestEmail(stage, appMode)
    ? TEST_RECIPIENTS
    : await fetchCreateEventSubscribers()

  const createdRecord = event.Records[0]
  const params = EmailableEvent.parse(createdRecord)

  const body = createEventAddedEmail({
    ...params,
    description: params.description ?? '',
    eventImageUrl: `${imageOrigin}${params.eventImagePath}`,
    eventUrl: `${hrefOrigin}/events/${params.eventId}`,
    preferencesUrl: `${hrefOrigin}/profile`,
  })

  // SES limits recipients to 50
  // to: hello@downtown65.com
  // bcc: max 49 recipients
  const recipientChunks = chunk(recipients, 49)

  for (const bccRecipients of recipientChunks) {
    await sendEmail({
      subject: `Uusi tapahtuma: ${params.title}`,
      body: {
        text: body.plain,
        html: body.html,
      },
      from: 'Kyttaki <noreply@downtown65.events>',
      recipients: ['hello@downtown65.com'],
      bccRecipients,
    })
  }

  if (!createdRecord) {
    console.error('Stream error, event not found')
  }
}
