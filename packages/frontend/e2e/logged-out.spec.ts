import { test, expect } from '@playwright/test'

test.describe('Logged out uses', () => {
  test('has title', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()
    await expect(page).toHaveTitle('Dt65 - login')

    await page.getByTestId('to-signup').click()
    await expect(
      page.getByRole('heading', { name: 'Rekisteröidy' })
    ).toBeVisible()
    await expect(page).toHaveTitle('Dt65 - signup')

    await page.getByTestId('to-login').click()
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()

    await page.getByTestId('to-forgot-password').click()
    await expect(
      page.getByRole('heading', { name: 'Salasana unohtunut' })
    ).toBeVisible()
    await expect(page).toHaveTitle('Dt65 - forgot password')

    await page.getByTestId('to-login').click()
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()

    await page.getByTestId('button-to-signup').click()
    await expect(
      page.getByRole('heading', { name: 'Rekisteröidy' })
    ).toBeVisible()

    await page.getByTestId('button-to-login').click()
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()
  })
})

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//
//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();
//
//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });
