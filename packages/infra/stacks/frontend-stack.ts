import type { StackContext } from '@serverless-stack/resources'
import { RemixSite, use } from '@serverless-stack/resources'
import { GraphqlStack } from './graphql-stack'

export const FrontendStack = ({ stack }: StackContext) => {
  const api = use(GraphqlStack)

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65Site', {
    path: 'packages/frontend',
    environment: {
      API_URL: api.ApiUrl,
      API_KEY: api.ApiKey,
    },
  })

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  })
}
