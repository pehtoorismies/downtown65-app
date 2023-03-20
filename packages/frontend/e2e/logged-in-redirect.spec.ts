import { expect, test } from '@playwright/test'

test.describe('Logged in user should be redirected to events page when navigating to', () => {
  test('login', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByTestId('breadcrumbs-current')).toHaveText(
      'Tapahtumat'
    )
  })

  test('forgot-password', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByTestId('breadcrumbs-current')).toHaveText(
      'Tapahtumat'
    )
  })

  test('signup', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByTestId('breadcrumbs-current')).toHaveText(
      'Tapahtumat'
    )
  })
})
