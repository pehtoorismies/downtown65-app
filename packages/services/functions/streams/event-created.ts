import { Config } from '@serverless-stack/node/config'
import type {
  DynamoDBStreamEvent,
  DynamoDBStreamHandler,
} from 'aws-lambda/trigger/dynamodb-stream'
import { getAuth0Management } from '../../support/auth0'

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
  event: DynamoDBStreamEvent,
  context
): Promise<void> => {
  console.log('Event:')
  console.log(JSON.stringify(event, undefined, 2))
  console.log('Context:')
  console.log(JSON.stringify(context, undefined, 2))
  if (Config.EMAIL_SENDING_ENABLED !== 'true') {
    console.log('EMAIL_SENDING_ENABLED: false')
    return
  }

  const users = await fetchCreateEventSubscribers()
  console.log(users)

  const createdRecord = event.Records[0]
  console.log(createdRecord)

  console.log(event)
  for (const r of event.Records) {
    console.log(r.dynamodb)
  }
}
