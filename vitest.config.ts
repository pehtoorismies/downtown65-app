/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 30_000,
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  plugins: [tsconfigPaths()],
})
