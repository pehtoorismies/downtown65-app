import { expect, test } from '@playwright/test'

test.describe('Members page', () => {
  test('should show members', async ({ page }) => {
    await page.goto('/events')
    await page.getByRole('link', { name: 'Jäsenet' }).click()
    await expect(
      page.getByRole('heading', { name: 'Seuran jäsenet' })
    ).toBeVisible()
    await expect(page.getByText(/^Jäseniä yhteensä: \d+$/)).toBeVisible()
  })
})
