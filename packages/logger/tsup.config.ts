import { type Options, defineConfig } from 'tsup'

export default defineConfig((options: Options) => ({
  entry: ['src/logger.ts'],
  clean: true,
  dts: true,
  format: ['esm'],
  ...options,
}))
