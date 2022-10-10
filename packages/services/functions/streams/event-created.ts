import type {
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
} from 'aws-lambda/trigger/dynamodb-stream'
import { getAuth0Management } from '../../support/auth0'

const management = await getAuth0Management()

const fetchCreateEventSubscribers = async () => {
  try {
    const users = await management.getUsers({
      fields: 'email,name',
      search_engine: 'v3',
      q: `user_metadata.subscribeEventCreationEmail:true`,
    })

    return users
  } catch (error) {
    console.error(error)
    return []
  }
}

export const main: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent,
  context
): Promise<void> => {
  console.log('Send email to participants')
  console.log('Event:')
  console.log(JSON.stringify(event, null, 2))
  console.log('Context:')
  console.log(JSON.stringify(context, null, 2))

  // const users = await fetchCreateEventSubscribers()
  // console.log(users)
  //
  // const createdRecord = event.Records[0]
  // console.log(createdRecord)
  //
  // console.log(event)
  // for (const r of event.Records) {
  //   console.log(r.dynamodb)
  // }
}
