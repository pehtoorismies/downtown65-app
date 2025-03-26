import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as route53 from 'aws-cdk-lib/aws-route53'
import type { StackContext } from 'sst/constructs'
import { RemixSite, use } from 'sst/constructs'
import { ConfigStack } from './config-stack'
import { GraphqlStack } from './graphql-stack'
import { MediaBucketStack } from './media-bucket-stack'
import { getDomainStage } from './support/get-domain-stage'

const getCustomDomain = ({ app, stack }: StackContext) => {
  const { stage } = app

  const domainStage = getDomainStage(stage)

  switch (domainStage.accountType) {
    case 'production': {
      const hostedZone = route53.HostedZone.fromLookup(stack, 'HostedZone', {
        domainName: 'downtown65.events',
      })

      return {
        domainName: 'downtown65.events',
        domainAlias: 'www.downtown65.events',
        cdk: {
          hostedZone,
          certificate: new acm.DnsValidatedCertificate(stack, 'Certificate', {
            domainName: 'downtown65.events',
            hostedZone,
            region: 'us-east-1',
            subjectAlternativeNames: ['*.downtown65.events'],
          }),
        },
      }
    }
    case 'staging': {
      const hostedZone = route53.HostedZone.fromLookup(stack, 'HostedZone', {
        domainName: 'staging.downtown65.events',
      })
      return {
        domainName: domainStage.domainName,
        cdk: {
          hostedZone,
          certificate: new acm.DnsValidatedCertificate(stack, 'Certificate', {
            domainName: 'staging.downtown65.events',
            hostedZone,
            region: 'us-east-1',
            subjectAlternativeNames: ['*.staging.downtown65.events'],
          }),
        },
      }
    }
    case 'dev': {
      return
    }
  }
}

export const RemixStack = (stackContext: StackContext) => {
  const { stack, app } = stackContext
  const { stage, mode } = app

  const { ApiUrl, ApiKey } = use(GraphqlStack)
  const { COOKIE_SECRET, HONEYPOT_SECRET } = use(ConfigStack)
  const { MEDIA_BUCKET_NAME, MEDIA_BUCKET_DOMAIN, mediaBucket } =
    use(MediaBucketStack)

  const sharpLayer = new lambda.LayerVersion(stack, `${stage}-SharpLayer'`, {
    code: lambda.Code.fromAsset('stacks/layers/sharp'),
    compatibleArchitectures: [lambda.Architecture.ARM_64],
  })

  const customDomain = getCustomDomain(stackContext)

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65-remix', {
    path: 'apps/web',
    runtime: 'nodejs22.x',
    bind: [COOKIE_SECRET, HONEYPOT_SECRET],
    warm: stage === 'production' ? 5 : undefined,
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
      // TODO: SMELL localhost
      DOMAIN_NAME: customDomain?.domainName ?? 'localhost:3000',
      STORAGE_BUCKET: MEDIA_BUCKET_NAME.value,
      MEDIA_DOMAIN: MEDIA_BUCKET_DOMAIN.value,
      APP_MODE: mode,
      APP_STAGE: stage,
    },
    customDomain,
    nodejs: {
      esbuild: {
        external: ['sharp'],
      },
    },
  })

  site.attachPermissions([mediaBucket])

  const serverHandler = site.cdk?.function as unknown as lambda.Function

  if (serverHandler) {
    serverHandler.addLayers(sharpLayer)
  }

  // Add the site's URL to stack output
  stack.addOutputs({
    WebsiteUrl: site.url ?? 'localhost',
    CustomDomainUrl: site.customDomainUrl ?? 'no_custom_domain',
    FuncArn: site.cdk?.function?.functionArn ?? 'no_func_arn',
  })
}
