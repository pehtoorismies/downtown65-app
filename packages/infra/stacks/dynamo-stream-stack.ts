import type { StackContext } from '@serverless-stack/resources'
import { Function, use } from '@serverless-stack/resources'
import { ConfigStack } from './config-stack'
import { DynamoStack } from './dynamo-stack'
import { getDomain } from './support/get-domain'

export const DynamoStreamStack = ({ app, stack }: StackContext) => {
  const dynamo = use(DynamoStack)
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack)

  const eventCreatedFunction = new Function(stack, 'EventCreated', {
    srcPath: 'packages/services',
    handler: 'src/functions/streams/event-created.main',
    bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
    permissions: ['ses:SendEmail', 'ses:SendRawEmail'],
    environment: {
      DOMAIN_NAME: getDomain(app.stage),
      SST_STAGE: app.stage,
    },
  })

  dynamo.table.addConsumers(stack, {
    eventCreated: {
      function: eventCreatedFunction,
      // https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html#filtering-examples
      filters: [
        {
          eventName: ['INSERT'],
          dynamodb: {
            // "Keys": {...},
            // "NewImage": {...},
            // "OldImage": {...}
            NewImage: {
              _et: {
                // pick only Dt65Event entity types
                S: ['Dt65Event'],
              },
            },
          },
        },
      ],
    },
  })
}
