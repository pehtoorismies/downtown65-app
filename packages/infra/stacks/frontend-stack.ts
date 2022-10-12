import type { StackContext } from '@serverless-stack/resources'
import { RemixSite } from '@serverless-stack/resources'

export const FrontendStack = ({ stack }: StackContext) => {
  // ... existing constructs

  // Create the Remix site
  const site = new RemixSite(stack, 'Downtown65Site', {
    path: 'packages/frontend',
  })

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  })
}
