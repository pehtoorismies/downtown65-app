import type { CodegenConfig } from '@graphql-codegen/cli'

const pluginConfig = {
  useTypeImports: true,
  nonOptionalTypename: true,
  defaultScalarType: 'unknown',
  scalars: {
    AWSDate: 'ISODate',
    AWSTime: 'ISOTime',
    AWSEmail: 'string',
  },
}

const addPlugin = {
  content: "import type { ISODate, ISOTime } from '@downtown65-app/time'",
}

const config: CodegenConfig = {
  schema: 'apps/backend/src/graphql-appsync/schema.graphql',
  documents: ['apps/web/app/**/*.tsx', 'apps/web/app/**/*.ts'],
  generates: {
    './packages/types/src/index.ts': {
      plugins: [
        'typescript',
        {
          add: addPlugin,
        },
      ],
      config: pluginConfig,
    },
    './apps/web/app/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      plugins: [
        {
          add: addPlugin,
        },
      ],
      config: pluginConfig,
    },
  },
  hooks: { afterOneFileWrite: ['prettier --write'] },
}

export default config
