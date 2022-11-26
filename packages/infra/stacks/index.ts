import type { App } from '@serverless-stack/resources'
import { RemovalPolicy } from 'aws-cdk-lib'
import { ConfigStack } from './config-stack'
import { CronStack } from './cron-stack'
import { DynamoStack } from './dynamo-stack'
import { DynamoStreamStack } from './dynamo-stream-stack'
import { GraphqlStack } from './graphql-stack'
import { RemixStack } from './remix-stack'

export default function (app: App) {
  if (app.stage !== 'production') {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY)
  }
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    bundle: {
      format: 'esm',
      loader: {
        '.mjml': 'text',
      },
    },
    logRetention: 'one_month',
  })
  app
    .stack(ConfigStack)
    .stack(DynamoStack)
    .stack(DynamoStreamStack)
    .stack(CronStack)
    .stack(GraphqlStack)
    .stack(RemixStack)
}
