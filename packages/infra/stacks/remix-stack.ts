import type { StackContext } from '@serverless-stack/resources'
import { RemixSite, use } from '@serverless-stack/resources'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { getEnvironmentVariable } from './get-environment'
import { GraphqlStack } from './graphql-stack'

export const RemixStack = ({ stack, app }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)

  const hostedZone = route53.HostedZone.fromLookup(stack, 'HostedZone', {
    domainName: 'downtown65.events',
  })

  const stage = app.stage
  const domainName =
    stage === 'production' ? 'downtown65.events' : `${stage}.downtown65.events`

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

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
    CUSTOM_DOMAIN_URL: site.customDomainUrl ?? 'no_custom_domain',
  })
}
