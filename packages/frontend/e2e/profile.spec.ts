import { expect, test } from '@playwright/test'
import { testUser } from './test-user'

test.describe('Profile page', () => {
  test('should show members', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByTestId('profile-nick')).toHaveText(testUser.nick)
    await expect(page.getByTestId('profile-email')).toHaveText(testUser.email)
  })
})
