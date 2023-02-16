import { getEnvironmentVariable } from '@downtown65-app/common'
import type { StackContext } from '@serverless-stack/resources'
import { RemixSite, use } from '@serverless-stack/resources'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { GraphqlStack } from './graphql-stack'
import { MediaBucketStack } from './media-bucket-stack'
import { getDomain } from './support/get-domain'

export const RemixStack = ({ stack, app }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)
  const { MediaBucketName, CloudfrontDomainName } = use(MediaBucketStack)

  const hostedZone = route53.HostedZone.fromLookup(stack, 'HostedZone', {
    domainName: 'downtown65.events',
  })

  const stage = app.stage

  const domainName = getDomain(stage)

  const certificate = new acm.DnsValidatedCertificate(stack, 'Certificate', {
    domainName: `downtown65.events`,
    hostedZone,
    region: 'us-east-1',
    subjectAlternativeNames: ['*.downtown65.events'],
  })

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65-remix', {
    path: 'packages/frontend',
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
      SST_STAGE: stage,
      DOMAIN_NAME: domainName,
      COOKIE_SECRET: getEnvironmentVariable('COOKIE_SECRET'),
      STORAGE_BUCKET: MediaBucketName,
      MEDIA_DOMAIN: CloudfrontDomainName,
      // AUTH_CLIENT_ID: config.AUTH_CLIENT_ID.value,
    },
    customDomain: {
      domainName,
      domainAlias: stage === 'production' ? 'www.downtown65.events' : undefined,
      cdk: {
        hostedZone,
        certificate,
      },
    },
  })

  site.cdk.function?.addLayers(
    new lambda.LayerVersion(stack, 'AppLayer', {
      code: lambda.Code.fromAsset('layers/sharp'),
    })
  )

  // site.cdk.distribution.addBehavior('media/*', new S3Origin(MediaBucketS3), {
  //   cachePolicy: CachePolicy.CACHING_OPTIMIZED,
  //   viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  //   allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
  // })

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
    CUSTOM_DOMAIN_URL: site.customDomainUrl ?? 'no_custom_domain',
  })
}
