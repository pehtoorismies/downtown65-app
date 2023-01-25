import { expect, test } from '@playwright/test'
import { testUser } from './test-user'

test.describe('Members page', () => {
  test('should show members', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByText(testUser.email)).toBeVisible()
    await expect(page.getByText(testUser.nick)).toBeVisible()
  })
})
