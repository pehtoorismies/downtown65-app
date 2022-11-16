/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 90_000,
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  plugins: [tsconfigPaths()],
})
