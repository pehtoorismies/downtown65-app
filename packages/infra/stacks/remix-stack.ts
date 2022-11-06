import type { StackContext } from '@serverless-stack/resources'
import { RemixSite, use } from '@serverless-stack/resources'
import { GraphqlStack } from './graphql-stack'

export const RemixStack = ({ stack }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65-remix', {
    path: 'packages/frontend',
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
    },
  })

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  })
}
