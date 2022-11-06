import * as appsync from '@aws-cdk/aws-appsync-alpha'
import type { StackContext } from '@serverless-stack/resources'
import { AppSyncApi, Config, Function, use } from '@serverless-stack/resources'
import * as cdk from 'aws-cdk-lib'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { ConfigStack } from './config-stack'
import { DynamoStack } from './dynamo-stack'
import { getEnvironmentVariable } from './get-environment'

export const GraphqlStack = ({ stack }: StackContext) => {
  const dynamoStack = use(DynamoStack)
  const {
    AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET,
    AUTH_DOMAIN,
    JWT_AUDIENCE,
    REGISTER_SECRET,
  } = use(ConfigStack)

  const gqlFunction = new Function(stack, 'AppSyncApiFunction', {
    srcPath: 'packages/services',
    handler: 'src/functions/gql/gql.main',
    config: [
      AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET,
      AUTH_DOMAIN,
      JWT_AUDIENCE,
      REGISTER_SECRET,
      dynamoStack.TABLE_NAME,
    ],
  })

  //  Create the AppSync GraphQL API
  const gqlApi = new AppSyncApi(stack, 'AppSyncApi', {
    schema: 'packages/services/src/functions/gql/schema.graphql',
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
      'Mutation updateEvent': 'gql',
      'Mutation deleteEvent': 'gql',
      'Mutation leaveEvent': 'gql',
      'Mutation participateEvent': 'gql',
      'Mutation updateMe': 'gql',
      'Mutation login': 'gql',
      'Mutation signup': 'gql',
      'Mutation forgotPassword': 'gql',
    },
  })

  gqlApi.attachPermissions([dynamoStack.table])

  new Config.Parameter(stack, 'API_URL', {
    value: gqlApi.url,
  })
  new Config.Parameter(stack, 'API_ACCESS_KEY', {
    value: gqlApi.cdk.graphqlApi.apiKey || 'No api key received',
  })

  const ApiId = gqlApi.apiId
  const ApiKey = gqlApi.cdk.graphqlApi.apiKey || 'No api key received'
  const ApiUrl = gqlApi.url

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiId,
    ApiKey,
    ApiUrl,
  })

  return {
    ApiId,
    ApiKey,
    ApiUrl,
  }
}
