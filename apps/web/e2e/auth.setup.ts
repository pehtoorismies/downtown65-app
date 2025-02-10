import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test as setup } from '@playwright/test'
import { LoginPage } from './page-objects/login-page'
import { testUser } from './test-user'

// @ts-ignore
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const authFile = path.join(__dirname, '../playwright/.auth/user.json')

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.submitLogin({
    email: testUser.email,
    password: testUser.password,
  })

  await page.waitForURL('**/events')
  await page.context().storageState({ path: authFile })
})
