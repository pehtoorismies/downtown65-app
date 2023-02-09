import type { StackContext } from '@serverless-stack/resources'
import { Bucket } from '@serverless-stack/resources'
import { RemovalPolicy } from 'aws-cdk-lib'

export const MediaBucketStack = ({ app, stack }: StackContext) => {
  const removalPolicy =
    app.stage === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY

  const bucket = new Bucket(stack, 'mediaBucket', {
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy,
      },
    },
  })

  stack.addOutputs({
    mediaBucketName: bucket.bucketName,
  })

  return {
    MediaBucketName: bucket.bucketName,
  }
}
