import type { StackContext } from '@serverless-stack/resources'
import { RemixSite, use } from '@serverless-stack/resources'
// import { ConfigStack } from './config-stack'
import { GraphqlStack } from './graphql-stack'

export const RemixStack = ({ stack }: StackContext) => {
  const { ApiUrl, ApiKey } = use(GraphqlStack)
  // const config = use(ConfigStack)

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65-remix', {
    path: 'packages/frontend',
    environment: {
      API_URL: ApiUrl,
      API_KEY: ApiKey,
      // AUTH_CLIENT_ID: config.AUTH_CLIENT_ID.value,
    },
  })

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  })
}
