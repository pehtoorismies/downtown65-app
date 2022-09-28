import {
  Api,
  AppSyncApi,
  Cron,
  Function,
  StackContext,
  Table,
  use,
} from '@serverless-stack/resources'
import { ConfigStack } from './config-stack'
import { getEnvironmentVariable } from './get-environment'

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

  const weeklyEmailFun = new Function(stack, 'WeeklyEmail', {
    handler: 'functions/scheduled/send-weekly-email.main',
    config: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
  })

  new Cron(stack, 'WeeklyEmailCron', {
    // https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
    schedule: 'cron(0 10 ? * MON *)',
    job: weeklyEmailFun,
    enabled: false,
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

  const jwt = {
    issuer: `https://${getEnvironmentVariable('AUTH_DOMAIN')}/`,
    audience: [getEnvironmentVariable('JWT_AUDIENCE')],
  }

  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    authorizers: {
      auth0: {
        type: 'jwt',
        jwt,
      },
    },
    defaults: {
      authorizer: 'auth0',
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
      'PUT /event/{id}': 'functions/events/update-event.main',
      'PUT /event/{id}/join': 'functions/events/join-event.main',
      'PUT /event/{id}/leave': 'functions/events/leave-event.main',
      // auth
      'POST /auth/login': {
        function: 'functions/auth/login.main',
        authorizer: 'none',
      },
      'POST /auth/signup': {
        function: 'functions/auth/signup.main',
        authorizer: 'none',
      },
      // users
      'GET /users/{id}': 'functions/users/get-user.main',
    },
  })

  const gqlFunction = new Function(stack, 'AppSyncApiFunction', {
    handler: 'graphql/gql.main',
    config: [
      AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET,
      AUTH_DOMAIN,
      JWT_AUDIENCE,
      REGISTER_SECRET,
    ],
    environment: {
      tableName: table.tableName,
    },
  })

  //  Create the AppSync GraphQL API
  const gqlApi = new AppSyncApi(stack, 'AppSyncApi', {
    schema: 'services/graphql/schema.graphql',
    dataSources: {
      gql: gqlFunction,
    },
    resolvers: {
      'Query    event': 'gql',
      'Query    events': 'gql',
      'Query    me': 'gql',
      'Mutation createEvent': 'gql',
      'Mutation login': 'gql',
      'Mutation signup': 'gql',
      // LEGACY
      'Query    findEvent': 'gql',
      'Query    findManyEvents': 'gql',
    },
  })

  gqlApi.attachPermissions([table])

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  })
  stack.addOutputs({
    ApiId: gqlApi.apiId,
    ApiKey: gqlApi.cdk.graphqlApi.apiKey || '',
    APiUrl: gqlApi.url,
  })
}
