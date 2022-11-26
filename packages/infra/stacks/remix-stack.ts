import type { StackContext } from '@serverless-stack/resources'
import { RemixSite, use } from '@serverless-stack/resources'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
import { GraphqlStack } from './graphql-stack'

export const RemixStack = ({ stack, app }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)

  const hostedZone = route53.HostedZone.fromLookup(stack, 'HostedZone', {
    domainName: 'downtown65.events',
  })

  const stage = app.stage

  const remixSiteProps = {
    path: 'packages/frontend',
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
      // AUTH_CLIENT_ID: config.AUTH_CLIENT_ID.value,
    },
  }

  if (stage !== 'production') {
    const prSite = new RemixSite(stack, 'Downtown65-remix', remixSiteProps)
    stack.addOutputs({
      URL: prSite.url,
    })
    return
  }

  const certificate = new acm.DnsValidatedCertificate(stack, 'Certificate', {
    domainName: `downtown65.events`,
    hostedZone,
    region: 'us-east-1',
    subjectAlternativeNames: [
      '*.downtown65.events',
      // 'beta.downtown65.events',
      // 'development.downtown65.events',
      // 'staging.downtown65.events',
    ],
  })

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65-remix', {
    ...remixSiteProps,
    customDomain: {
      domainName: 'beta.downtown65.events',
      cdk: {
        hostedZone,
        certificate,
      },
    },
  })

  const recordProps = {
    recordName: 'beta.downtown65.events',
    zone: hostedZone,
    target: route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(site.cdk.distribution)
    ),
  }

  new route53.ARecord(stack, 'AlternateARecord', recordProps)
  new route53.AaaaRecord(stack, 'AlternateAAAARecord', recordProps)

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  })
}
