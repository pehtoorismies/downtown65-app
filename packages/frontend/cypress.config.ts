import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    projectId: 'g3n6uv',
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
})
