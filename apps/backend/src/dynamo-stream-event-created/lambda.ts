import { logger } from '@downtown65-app/logger/logger'
import { getEnvironmentVariable } from '@downtown65-app/util/get-environment-variable'
import type { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import { chunk } from 'remeda'
import { EmailableEvent, createEventAddedEmail, sendEmail } from './email'
import { getAuth0Management } from '~/common/auth0-clients'

const TEST_RECIPIENTS = ['dt65eventstest@mailinator.com']

const fetchCreateEventSubscribers = async (): Promise<string[]> => {
  const management = await getAuth0Management()
  try {
    const users = await management.users.getAll({
      fields: 'email,name',
      search_engine: 'v3',
      q: `user_metadata.subscribeEventCreationEmail:true`,
    })

    return users.data.map(({ email }) => email).filter(Boolean) as string[]
  } catch (error) {
    logger.error(error, 'Error when fetching users subscribed to eventCreated')
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
  const createdRecord = event.Records[0]

  if (!createdRecord) {
    logger.error(event, 'Stream error, event not found (event.Records[0])')
    return
  }

  const stage = getEnvironmentVariable('APP_STAGE')
  const appMode = getEnvironmentVariable('APP_MODE')
  const domainName = getEnvironmentVariable('DOMAIN_NAME')
  logger.info({ stage, appMode, domainName }, 'DynamoStream EventCreated')

  const imageOrigin =
    appMode === 'dev' ? 'https://downtown65.events' : `https://${domainName}`

  const hrefOrigin =
    appMode === 'dev' ? 'http://localhost:3000' : `https://${domainName}`

  const recipients = isTestEmail(stage, appMode)
    ? TEST_RECIPIENTS
    : await fetchCreateEventSubscribers()

  logger.info(recipients, 'Will send to recipients')

  const result = EmailableEvent.safeParse(createdRecord)
  if (!result.success) {
    logger.error(result.error, 'Parsing failed')
    return
  }

  const params = result.data

  const body = createEventAddedEmail({
    ...params,
    description: params.description ?? '',
    eventImageUrl: `${imageOrigin}${params.eventImagePath}`,
    eventUrl: `${hrefOrigin}/events/${params.eventId}`,
    preferencesUrl: `${hrefOrigin}/profile`,
    facebookLogoUrl: `${imageOrigin}/logos/fb-logo.png`,
  })

  logger.info(body.plain, 'Email as text')

  // SES limits recipients to 50
  // to: hello@downtown65.com
  // bcc: max 49 recipients
  const recipientChunks = chunk(recipients, 49)

  for (const bccRecipients of recipientChunks) {
    const batchResult = await sendEmail({
      subject: `Uusi tapahtuma: ${params.title}`,
      body: {
        text: body.plain,
        html: body.html,
      },
      from: 'Kyttaki <noreply@downtown65.events>',
      recipients: ['hello@downtown65.com'],
      bccRecipients,
    })
    logger.info(batchResult, 'Batch send emails result')
  }
}
