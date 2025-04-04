import * as appsync from '@aws-cdk/aws-appsync-alpha'
import * as cdk from 'aws-cdk-lib'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { AppSyncApi, Function as SSTFunction, use } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'
import { ConfigStack } from './config-stack'
import { DynamoStack } from './dynamo-stack'
import { MediaBucketStack } from './media-bucket-stack'

export const GraphqlStack = ({ app, stack }: StackContext) => {
  const { TABLE_NAME, table } = use(DynamoStack)
  const { MEDIA_BUCKET_NAME, MEDIA_BUCKET_DOMAIN, mediaBucket } =
    use(MediaBucketStack)
  const {
    AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET,
    AUTH_DOMAIN,
    JWT_AUDIENCE,
    REGISTER_SECRET,
  } = use(ConfigStack)

  const gqlFunction = new SSTFunction(stack, 'AppSyncApiFunction', {
    handler: 'apps/backend/src/graphql-appsync/lambda.handler',
    bind: [
      AUTH_CLIENT_ID,
      AUTH_CLIENT_SECRET,
      AUTH_DOMAIN,
      JWT_AUDIENCE,
      REGISTER_SECRET,
      TABLE_NAME,
      MEDIA_BUCKET_DOMAIN,
      MEDIA_BUCKET_NAME,
    ],
  })

  gqlFunction.attachPermissions([mediaBucket])

  //  Create the AppSync GraphQL API
  const gqlApi = new AppSyncApi(stack, 'AppSyncApi', {
    schema: 'apps/backend/src/graphql-appsync/schema.graphql',
    cdk: {
      graphqlApi: {
        logConfig: {
          excludeVerboseContent: false,
          fieldLogLevel:
            app.stage === 'production'
              ? appsync.FieldLogLevel.ERROR
              : appsync.FieldLogLevel.ALL,
          retention:
            app.stage === 'production'
              ? RetentionDays.TWO_MONTHS
              : RetentionDays.THREE_DAYS,
        },
        xrayEnabled: false,
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.OIDC,
            openIdConnectConfig: {
              oidcProvider: `https://${AUTH_DOMAIN.value}`,
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
      'Query    user': 'gql',
      'Mutation createEvent': 'gql',
      'Mutation updateEvent': 'gql',
      'Mutation deleteEvent': 'gql',
      'Mutation leaveEvent': 'gql',
      'Mutation participateEvent': 'gql',
      'Mutation updateMe': 'gql',
      'Mutation updateAvatar': 'gql',
      'Mutation login': 'gql',
      'Mutation signup': 'gql',
      'Mutation refreshToken': 'gql',
      'Mutation forgotPassword': 'gql',
    },
  })

  gqlApi.attachPermissions([table])

  const ApiId = gqlApi.apiId
  const ApiKey = gqlApi.cdk.graphqlApi.apiKey || 'No api key received'
  const ApiUrl = gqlApi.url

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiId,
    ApiUrl,
  })

  return {
    ApiKey,
    ApiUrl,
  }
}
