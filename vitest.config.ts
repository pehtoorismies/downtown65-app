/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 30_000,
    globalSetup: ['./services/test/global-setup.ts'],
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  resolve: {
    alias: {
      '@downtown65-app/core': './services/core',
    },
  },
})
