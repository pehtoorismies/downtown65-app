/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 30_000,
    globalSetup: ['./packages/services/src/test/global-setup.ts'],
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  // resolve: {
  //   alias: {
  //     '@downtown65-app/core': './services/core',
  //   },
  // },
  plugins: [tsconfigPaths()],
})
