import type { StackContext } from 'sst/constructs'
import { Function, use } from 'sst/constructs'
import { ConfigStack } from './config-stack'
import { DynamoStack } from './dynamo-stack'
import { getDomainStage } from './support/get-domain-stage'

export const DynamoStreamStack = ({ app, stack }: StackContext) => {
  const domainStage = getDomainStage(app.stage)

  if (domainStage.accountType === 'dev') {
    return
  }

  const dynamo = use(DynamoStack)
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack)

  const eventCreatedFunction = new Function(stack, 'EventCreated', {
    handler: 'apps/backend/src/dynamo-stream-event-created/lambda.handler',
    bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
    permissions: ['ses:SendEmail', 'ses:SendRawEmail'],
    environment: {
      DOMAIN_NAME: domainStage.domainName,
    },
    nodejs: {
      // needed for mjml library to work
      // https://github.com/mjmlio/mjml/issues/2132
      install: ['uglify-js'],
      // needed for mjml library to work
      esbuild: {
        loader: {
          '.mjml': 'text',
        },
      },
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
