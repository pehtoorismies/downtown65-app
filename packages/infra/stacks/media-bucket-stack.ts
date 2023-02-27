import type { StackContext } from '@serverless-stack/resources'
import { Bucket, use } from '@serverless-stack/resources'
import { RemovalPolicy } from 'aws-cdk-lib'
import cloudfront, {
  AllowedMethods,
  CachePolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { ConfigStack } from './config-stack'

export const MediaBucketStack = ({ app, stack }: StackContext) => {
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack)

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

  // Allow the notification functions to access the bucket
  bucket.attachPermissions([bucket])

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
    }
  )
  mediaCloudFront.applyRemovalPolicy(
    app.stage === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY
  )

  // TODO: remove notifications when https://github.com/serverless-stack/sst/issues/2522 is resolved
  bucket.addNotifications(stack, {
    resize: {
      function: {
        handler: 'packages/services/src/functions/image/resize.main',
        bundle: {
          externalModules: ['sharp'],
        },
        layers: [
          new lambda.LayerVersion(stack, 'AppLayer', {
            code: lambda.Code.fromAsset('packages/infra/layers/sharp'),
          }),
        ],
      },
      events: ['object_created'],
      filters: [{ prefix: 'uploads/' }],
    },
  })
  bucket.attachPermissionsToNotification('resize', [bucket])

  bucket.addNotifications(stack, {
    updateAvatar: {
      function: {
        handler:
          'packages/services/src/functions/update-avatar/update-avatar.main',
        environment: {
          MEDIA_DOMAIN: mediaCloudFront.distributionDomainName,
        },
        bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
      },
      events: ['object_created'],
      filters: [{ prefix: 'avatars/' }],
    },
  })
  bucket.attachPermissionsToNotification('updateAvatar', [bucket])

  stack.addOutputs({
    mediaBucketName: bucket.bucketName,
  })

  return {
    MediaBucketName: bucket.bucketName,
    CloudfrontDomainName: mediaCloudFront.distributionDomainName,
  }
}
