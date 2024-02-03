import { type Options, defineConfig } from 'tsup'

export default defineConfig((options: Options) => ({
  entryPoints: ['src/index.ts'],
  clean: true,
  dts: true,
  loader: {
    '.mjml': 'text',
  },
  format: ['cjs'],
  ...options,
}))
