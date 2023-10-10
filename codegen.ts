import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'packages/functions/src/gql/schema.graphql',
  documents: ['packages/web/app/**/*.graphql'],
  generates: {
    './packages/graphql/src/': {
      preset: 'client',
    },
  },
}
export default config
