import {
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
} from 'aws-lambda/trigger/dynamodb-stream'
import { getAuth0Management } from '../../support/auth'

const fetchCreateEventSubscribers = async () => {
  const management = await getAuth0Management()

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
  event: DynamoDBStreamEvent
): Promise<void> => {
  console.log('Send email to participants')

  const users = await fetchCreateEventSubscribers()
  console.log(users)
  //
  // const createdRecord = event.Records[0]
  // console.log(createdRecord)
  //
  console.log(event)
  // for (const r of event.Records) {
  //   console.log(r.dynamodb)
  // }
}
