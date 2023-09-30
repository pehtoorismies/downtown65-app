import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import type { StackContext } from 'sst/constructs'
import { RemixSite, use } from 'sst/constructs'
import { GraphqlStack } from './graphql-stack'
import { MediaBucketStack } from './media-bucket-stack'
import { getDomain } from './support/get-domain'
import { getEnvironmentVariable } from './support/get-environment-variable'

export const RemixStack = ({ stack, app }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)
  const { MEDIA_BUCKET_NAME, MEDIA_BUCKET_DOMAIN, mediaBucket } =
    use(MediaBucketStack)

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
      STORAGE_BUCKET: MEDIA_BUCKET_NAME.value,
      MEDIA_DOMAIN: MEDIA_BUCKET_DOMAIN.value,
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

  site.attachPermissions([mediaBucket])

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
    CUSTOM_DOMAIN_URL: site.customDomainUrl ?? 'no_custom_domain',
  })
}
