/// <reference types="vitest" />

import dotenv from 'dotenv'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenv.config({ path: envFile })

export default defineConfig({
  test: {
    testTimeout: 90_000,
    watch: false,
    exclude: [...configDefaults.exclude],
  },
  cacheDir: '.cache/vitest',
  logLevel: 'info',
  esbuild: {
    sourcemap: 'both',
  },

  plugins: [tsconfigPaths()],
})
