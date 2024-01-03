import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'packages/functions/src/gql/schema.graphql',
  documents: ['packages/web/app/**/*.tsx', 'packages/web/app/**/*.ts'],
  generates: {
    './packages/graphql/src/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      plugins: [
        {
          add: {
            content:
              "import type { ISODate, ISOTime } from '@downtown65-app/core/event-time'",
          },
        },
      ],
      config: {
        // dedupeFragments: false,
        useTypeImports: true,
        nonOptionalTypename: true,
        defaultScalarType: 'unknown',
        // avoidOptionals: true,
        // avoidOptionals: {
        //   field: true,
        //   inputValue: false,
        //   object: true,
        //   defaultValue: true,
        // },
        // maybeValue: 'T | null | undefined',
        scalars: {
          AWSDate: 'ISODate',
          AWSTime: 'ISOTime',
          AWSEmail: 'string',
        },
      },
    },
  },
  hooks: { afterOneFileWrite: ['prettier --write'] },
}
export default config
