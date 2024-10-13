import { type Options, defineConfig } from 'tsup'

export default defineConfig((options: Options) => ({
  entry: ['src/assert-unreachable.ts', 'src/get-environment-variable.ts'],
  clean: true,
  dts: true,
  format: ['esm'],
  ...options,
}))
