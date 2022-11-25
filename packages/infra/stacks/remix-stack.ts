import type { StackContext } from '@serverless-stack/resources'
import { RemixSite, use } from '@serverless-stack/resources'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
// import { ConfigStack } from './config-stack'
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
import { GraphqlStack } from './graphql-stack'

type CustomDomain = {
  domainName: string
  cdk: {
    hostedZone: route53.IHostedZone
    certificate: acm.Certificate
  }
}

const getCustomDomain = (
  stage: string,
  hostedZone: route53.IHostedZone,
  certificate: acm.Certificate
): CustomDomain | undefined => {
  if (stage === 'production') {
    return {
      domainName: 'beta.downtown65.events',
      cdk: {
        hostedZone,
        certificate,
      },
    }
  }
  if (stage === 'development') {
    return {
      domainName: 'development.downtown65.events',
      cdk: {
        hostedZone,
        certificate,
      },
    }
  }
}

export const RemixStack = ({ stack, app }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)
  // const config = use(ConfigStack)

  const hostedZone = route53.HostedZone.fromLookup(stack, 'HostedZone', {
    domainName: 'downtown65.events',
  })

  const certificate = new acm.DnsValidatedCertificate(stack, 'Certificate', {
    domainName: 'downtown65.events',
    hostedZone,
    region: 'us-east-1',
    subjectAlternativeNames: [
      'www.downtown65.events',
      'beta.downtown65.events',
      'development.downtown65.events',
      'staging.downtown65.events',
    ],
  })

  const customDomain = getCustomDomain(app.stage, hostedZone, certificate)

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65-remix', {
    path: 'packages/frontend',
    customDomain,
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
      // AUTH_CLIENT_ID: config.AUTH_CLIENT_ID.value,
    },
  })

  if (customDomain) {
    const recordProps = {
      recordName: customDomain.domainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(site.cdk.distribution)
      ),
    }
    new route53.ARecord(stack, `AlternateARecord_${app.stage}`, recordProps)
    new route53.AaaaRecord(
      stack,
      `AlternateAAAARecord_${app.stage}`,
      recordProps
    )
  }

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  })
}
