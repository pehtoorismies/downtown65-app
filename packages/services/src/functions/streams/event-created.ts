import { Config } from '@serverless-stack/node/config'
import type {
  DynamoDBRecord,
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
} from 'aws-lambda/trigger/dynamodb-stream'
import type { EmailableEvent } from '~/email/create-event-added-email'
import { createEventAddedEmail } from '~/email/create-event-added-email'
// import { getAuth0Management } from '~/support/auth0'

// const fetchCreateEventSubscribers = async () => {
//   const management = await getAuth0Management()
//   try {
//     const users = await management.getUsers({
//       fields: 'email,name',
//       search_engine: 'v3',
//       q: `user_metadata.subscribeEventCreationEmail:true`,
//     })
//
//     return users
//   } catch (error) {
//     console.error(error)
//     return []
//   }
// }

const mapDynamoRecord = (dynamoRecord: DynamoDBRecord): EmailableEvent => {
  console.log(JSON.stringify(dynamoRecord))
  return {
    eventImageUrl: 'some_url',
    eventUrl: 'some_url',
    title: 'Some title',
    subtitle: 'Some subtitle',
    date: 'Some date',
    description: 'Some desc',
  }
}

export const main: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
): Promise<void> => {
  if (Config.EMAIL_SENDING_ENABLED !== 'true') {
    return
  }
  // Send email to subscribers
  // const users = await fetchCreateEventSubscribers()
  const createdRecord = event.Records[0]

  const emailEvent = mapDynamoRecord(createdRecord)
  const body = createEventAddedEmail(emailEvent)
  console.log(body)
  // await sendEmail({
  //   subject: 'Uusi tapahtuma',
  //   body: {
  //     text: body.plain,
  //     html: body.html,
  //   },
  //   from: 'kyttaki@downtown65.events',
  //   to: 'pehtoorismies@gmail.com',
  // })

  //downtown65.events/event-images/trailrunning.jpg

  if (!createdRecord) {
    console.error('Stream error, event not found')
  }
}
