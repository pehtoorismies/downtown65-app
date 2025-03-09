/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 90_000,
    exclude: [...configDefaults.exclude],
    cache: {
      dir: '.cache/vitest',
    },
  },
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },
  plugins: [tsconfigPaths()],
})
