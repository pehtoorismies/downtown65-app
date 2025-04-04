import { RemovalPolicy } from 'aws-cdk-lib'
import cloudfront, {
  AllowedMethods,
  CachePolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Bucket, Config } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'

export const MediaBucketStack = ({ app, stack }: StackContext) => {
  const removalPolicy =
    app.stage === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY

  const autoDeleteObjects = app.stage !== 'production'

  const bucket = new Bucket(stack, 'mediaBucket', {
    cdk: {
      bucket: {
        autoDeleteObjects,
        removalPolicy,
      },
    },
  })

  const mediaCloudFront = new cloudfront.Distribution(
    stack,
    'mediaDistribution',
    {
      defaultBehavior: {
        origin: new S3Origin(bucket.cdk.bucket),
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      },
      comment: `Serve from S3 media ${app.stage}`,
    },
  )
  mediaCloudFront.applyRemovalPolicy(
    app.stage === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
  )

  stack.addOutputs({
    mediaBucketName: bucket.bucketName,
  })

  return {
    MEDIA_BUCKET_NAME: new Config.Parameter(stack, 'MEDIA_BUCKET_NAME', {
      value: bucket.bucketName,
    }),
    MEDIA_BUCKET_DOMAIN: new Config.Parameter(stack, 'MEDIA_BUCKET_DOMAIN', {
      value: mediaCloudFront.distributionDomainName,
    }),
    mediaBucket: bucket,
  }
}
