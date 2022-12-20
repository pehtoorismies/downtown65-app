import { Config } from '@serverless-stack/node/config'
import type {
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
} from 'aws-lambda/trigger/dynamodb-stream'
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

export const main: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
): Promise<void> => {
  if (Config.EMAIL_SENDING_ENABLED !== 'true') {
    return
  }
  // Send email to subscribers
  // const users = await fetchCreateEventSubscribers()
  const createdRecord = event.Records[0]
  // console.log('DYNAMO RECORD--')
  // console.log(JSON.stringify(createdRecord))
  // console.log('--DYNAMO RECORD')

  // const emailEvent = mapDynamoRecord(createdRecord)
  // const body = createEventAddedEmail(emailEvent)

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
