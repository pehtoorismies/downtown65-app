import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as route53 from 'aws-cdk-lib/aws-route53'
import type { StackContext } from 'sst/constructs'
import { RemixSite, use } from 'sst/constructs'
import { ConfigStack } from './config-stack'
import { GraphqlStack } from './graphql-stack'
import { MediaBucketStack } from './media-bucket-stack'
import { getDomain } from './support/get-domain'

export const RemixStack = ({ stack, app }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)
  const { MEDIA_BUCKET_NAME, MEDIA_BUCKET_DOMAIN, mediaBucket } =
    use(MediaBucketStack)

  const sharpLayer = new lambda.LayerVersion(
    stack,
    `${app.stage}-SharpLayer'`,
    {
      code: lambda.Code.fromAsset('stacks/layers/sharp'),
      compatibleArchitectures: [lambda.Architecture.ARM_64],
    }
  )

  const hostedZone = route53.HostedZone.fromLookup(stack, 'HostedZone', {
    domainName: 'downtown65.events',
  })

  const stage = app.stage

  const domainName = getDomain(stage)

  const { COOKIE_SECRET } = use(ConfigStack)

  const certificate = new acm.DnsValidatedCertificate(stack, 'Certificate', {
    domainName: `downtown65.events`,
    hostedZone,
    region: 'us-east-1',
    subjectAlternativeNames: ['*.downtown65.events'],
  })

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65-remix', {
    path: 'packages/web',
    bind: [COOKIE_SECRET],
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
      SST_STAGE: stage,
      DOMAIN_NAME: domainName,
      STORAGE_BUCKET: MEDIA_BUCKET_NAME.value,
      MEDIA_DOMAIN: MEDIA_BUCKET_DOMAIN.value,
    },
    customDomain: {
      domainName,
      domainAlias: stage === 'production' ? 'www.downtown65.events' : undefined,
      cdk: {
        hostedZone,
        certificate,
      },
    },
    nodejs: {
      esbuild: {
        external: ['sharp'],
      },
    },
  })

  const serverHandler = site.cdk?.function as lambda.Function

  if (serverHandler) {
    serverHandler.addLayers(sharpLayer)
  }
  site.attachPermissions([mediaBucket])

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url ?? 'localhost',
    CUSTOM_DOMAIN_URL: site.customDomainUrl ?? 'no_custom_domain',
    FUNC_ARN: site.cdk?.function?.functionArn ?? 'no_func_arn',
  })
}
