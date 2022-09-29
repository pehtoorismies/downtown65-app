import * as appsync from '@aws-cdk/aws-appsync-alpha'
import type { StackContext } from '@serverless-stack/resources'
import {
  AppSyncApi,
  Cron,
  Function,
  Table,
  use,
} from '@serverless-stack/resources'
import * as cdk from 'aws-cdk-lib'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { ConfigStack } from './config-stack'
import { getEnvironmentVariable } from './get-environment'
// import { getEnvironmentVariable } from './get-environment'

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
  const eventCreatedFunction = new Function(stack, 'EventCreated', {
    handler: 'functions/streams/event-created.main',
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
                  S: ['Dt65Event'],
                },
              },
            },
          },
        ],
      },
    },
  })

  // const jwt = {
  //   issuer: `https://${getEnvironmentVariable('AUTH_DOMAIN')}/`,
  //   audience: [getEnvironmentVariable('JWT_AUDIENCE')],
  // }

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
    cdk: {
      graphqlApi: {
        logConfig: {
          excludeVerboseContent: false,
          fieldLogLevel: appsync.FieldLogLevel.ALL,
          retention: RetentionDays.ONE_WEEK,
        },
        xrayEnabled: false,
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: {
              oidcProvider: `https://${getEnvironmentVariable('AUTH_DOMAIN')}`,
            },
          },
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.API_KEY,
              apiKeyConfig: {
                expires: cdk.Expiration.after(cdk.Duration.days(365)),
              },
            },
          ],
        },
      },
    },
    dataSources: {
      gql: gqlFunction,
    },
    resolvers: {
      'Query    event': 'gql',
      'Query    events': 'gql',
      'Query    me': 'gql',
      'Query    users': 'gql',
      'Mutation createEvent': 'gql',
      'Mutation deleteEvent': 'gql',
      'Mutation updateEvent': 'gql',
      'Mutation login': 'gql',
      'Mutation signup': 'gql',
      'Mutation forgotPassword': 'gql',
    },
  })

  gqlApi.attachPermissions([table])

  // Show the API endpoint in the output
  // stack.addOutputs({
  //   ApiEndpoint: api.url,
  // })
  stack.addOutputs({
    ApiId: gqlApi.apiId,
    ApiKey: gqlApi.cdk.graphqlApi.apiKey || 'No api key received',
    APiUrl: gqlApi.url,
  })
}
