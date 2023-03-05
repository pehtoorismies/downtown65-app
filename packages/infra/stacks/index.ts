import type { App } from '@serverless-stack/resources'
import { RemovalPolicy } from 'aws-cdk-lib'
import { ConfigStack } from './config-stack'
import { CronStack } from './cron-stack'
import { DynamoStack } from './dynamo-stack'
import { DynamoStreamStack } from './dynamo-stream-stack'
import { GraphqlStack } from './graphql-stack'
// import { LambdaLayerStack } from './lambda-layer-stack'
import { MediaBucketStack } from './media-bucket-stack'
import { RemixStack } from './remix-stack'

export default function (app: App) {
  if (app.stage !== 'production') {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY)
  }
  app.setDefaultFunctionProps({
    // these are needed for mjml library to work
    bundle: {
      nodeModules: ['uglify-js'],
      externalModules: ['sharp'],
      format: 'esm',
      loader: {
        '.mjml': 'text',
      },
    },
    runtime: 'nodejs16.x',
    logRetention: app.stage === 'production' ? 'two_months' : 'three_days',
  })
  app
    .stack(ConfigStack)
    // .stack(LambdaLayerStack)
    .stack(MediaBucketStack)
    .stack(DynamoStack)
    .stack(DynamoStreamStack)
    .stack(CronStack)
    .stack(GraphqlStack)
    .stack(RemixStack)
}
