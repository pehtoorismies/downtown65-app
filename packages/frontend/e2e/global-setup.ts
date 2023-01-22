import * as fs from 'node:fs'
import { getEnvironmentVariable } from '@downtown65-app/common'
import type { FullConfig } from '@playwright/test'
import { chromium } from '@playwright/test'
import { LoginPage } from './page-objects/login-page'

async function globalSetup(config: FullConfig) {
  // already has auth cookies
  if (fs.existsSync('./storageState.json')) {
    return
  }

  const { baseURL } = config.projects[0].use

  const browser = await chromium.launch()
  const page = await browser.newPage({ baseURL })
  const loginPage = new LoginPage(page)
  await loginPage.goto()

  await loginPage.submitLogin({
    email: getEnvironmentVariable('USER_EMAIL'),
    password: getEnvironmentVariable('USER_PASSWORD'),
  })

  await page.waitForURL('**/events')

  await page.context().storageState({ path: 'storageState.json' })
  await browser.close()
}

export default globalSetup
