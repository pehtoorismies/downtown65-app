import { RemovalPolicy } from 'aws-cdk-lib'
import type { SSTConfig } from 'sst'
import { ConfigStack } from './stacks/config-stack'
import { CronStack } from './stacks/cron-stack'
import { DynamoStack } from './stacks/dynamo-stack'
import { DynamoStreamStack } from './stacks/dynamo-stream-stack'
import { GraphqlStack } from './stacks/graphql-stack'
import { LayerStack } from './stacks/layer-stack'
import { MediaBucketStack } from './stacks/media-bucket-stack'
import { RemixStack } from './stacks/remix-stack'

export default {
  config() {
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
      environment: {
        APP_MODE: app.mode,
        APP_STAGE: app.stage,
      },
      runtime: 'nodejs18.x',
      logRetention: app.stage === 'production' ? 'two_months' : 'three_days',
    })

    app
      .stack(ConfigStack)
      .stack(LayerStack)
      .stack(MediaBucketStack)
      .stack(DynamoStack)
      .stack(DynamoStreamStack)
      .stack(CronStack)
      .stack(GraphqlStack)
      .stack(RemixStack)
  },
} satisfies SSTConfig
