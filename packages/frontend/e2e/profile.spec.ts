import { expect, test } from '@playwright/test'
import { testUser } from './test-user'

test.describe('Profile page', () => {
  test('should show members', async ({ page }) => {
    await page.goto('/profile')
    await expect(page.getByTestId('profile-nick')).toHaveText(testUser.nick)
    await expect(page.getByTestId('profile-email')).toHaveText(testUser.email)
    await expect(page.getByTestId('breadcrumbs-current')).toHaveText(
      'Oma profiili'
    )

    await page.getByTestId('change-avatar-btn').click()
    await expect(
      page.getByRole('heading', { name: 'Vaihda profiilikuva' })
    ).toBeVisible()
    await expect(page.getByTestId('breadcrumbs-current')).toHaveText(
      'Vaihda profiilikuva'
    )
    const parentPageLink = page.getByTestId('breadcrumbs-parent')
    await expect(parentPageLink).toHaveText('Oma profiili')
    await parentPageLink.click()

    await expect(page.getByTestId('profile-nick')).toHaveText(testUser.nick)
  })
})
