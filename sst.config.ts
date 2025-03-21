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

const AWS_PROFILES = [
  'downtown65-development', // personal development
  'downtown65-staging', // pull requests
  'downtown65-production', // production
] as const
type AWSProfile = (typeof AWS_PROFILES)[number]

function getProfile(stage: string | undefined): AWSProfile {
  if (stage === 'production') {
    return 'downtown65-production'
  }
  if (stage?.startsWith('pr-')) {
    return 'downtown65-staging'
  }
  // if using 'sst dev' or some other stage use always development profile
  return 'downtown65-development'
}

export default {
  config(input) {
    return {
      name: 'downtown65-app',
      region: 'eu-north-1',
      profile: getProfile(input.stage),
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
      runtime: 'nodejs22.x',
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
