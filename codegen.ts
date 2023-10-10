import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'packages/functions/src/gql/schema.graphql',
  documents: ['packages/web/app/**/*.tsx', 'packages/web/app/**/*.ts'],
  generates: {
    './packages/graphql/src/': {
      preset: 'client',
    },
  },
  hooks: { afterOneFileWrite: ['prettier --write'] },
}
export default config
