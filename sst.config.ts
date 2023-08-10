import { RemovalPolicy } from 'aws-cdk-lib'
import { SSTConfig } from 'sst'
import { ConfigStack } from './stacks/config-stack'
import { CronStack } from './stacks/cron-stack'
import { DynamoStack } from './stacks/dynamo-stack'
import { DynamoStreamStack } from './stacks/dynamo-stream-stack'
import { GraphqlStack } from './stacks/graphql-stack'
import { MediaBucketStack } from './stacks/media-bucket-stack'
import { RemixStack } from './stacks/remix-stack'

export default {
  config(_input) {
    return {
      name: 'downtown65-app',
      region: 'eu-north-1',
    }
  },
  stacks(app) {
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
      .stack(MediaBucketStack)
      .stack(DynamoStack)
      .stack(DynamoStreamStack)
      .stack(CronStack)
      .stack(GraphqlStack)
      .stack(RemixStack)
  },
} satisfies SSTConfig
