import { defineConfig, mergeConfig } from 'vitest/config'
import viteTestConfig from '../../vitest.config'

export default mergeConfig(
  viteTestConfig,
  defineConfig({
    test: {
      exclude: ['e2e/**/*.ts'],
    },
  })
)
