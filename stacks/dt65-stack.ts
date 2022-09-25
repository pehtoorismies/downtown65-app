import {
  Api,
  Function,
  StackContext,
  Table,
  use,
} from '@serverless-stack/resources'
import { ConfigStack } from './config-stack'

export const Dt65Stack = ({ stack }: StackContext) => {
  // Config
  const {
    AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET,
    AUTH_DOMAIN,
    JWT_AUDIENCE,
    REGISTER_SECRET,
  } = use(ConfigStack)

  // Dynamo stream functions
  const eventCreatedFun = new Function(stack, 'EventCreated', {
    handler: 'functions/events/streams/event-created.main',
    config: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
  })

  // Create the table
  const table = new Table(stack, 'downtown65', {
    fields: {
      PK: 'string',
      SK: 'string',
      GSI1PK: 'string',
      GSI1SK: 'string',
      GSI2PK: 'string',
      GSI2SK: 'string',
    },
    primaryIndex: { partitionKey: 'PK', sortKey: 'SK' },
    globalIndexes: {
      GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
      GSI2: { partitionKey: 'GSI2PK', sortKey: 'GSI2SK' },
    },
    stream: true,
    consumers: {
      eventCreated: {
        function: eventCreatedFun,
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
                  S: ['Dt65Event'],
                },
              },
            },
          },
        ],
      },
    },
  })

  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        // Pass in the table name to our API
        environment: {
          tableName: table.tableName,
        },
        config: [
          AUTH_CLIENT_ID,
          AUTH_CLIENT_SECRET,
          AUTH_DOMAIN,
          JWT_AUDIENCE,
          REGISTER_SECRET,
        ],
        permissions: [table],
      },
    },
    routes: {
      // events
      'GET /events': 'functions/events/get-events.main',
      'GET /event/{id}': 'functions/events/get-event.main',
      'DELETE /event/{id}': 'functions/events/delete-event.main',
      'POST /event': 'functions/events/create-event.main',
      'PUT /event/{id}/join': 'functions/events/join-event.main',
      'PUT /event/{id}/leave': 'functions/events/leave-event.main',
      // auth
      'POST /auth/login': 'functions/auth/login.main',
      'POST /auth/signup': 'functions/auth/signup.main',
    },
  })

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
