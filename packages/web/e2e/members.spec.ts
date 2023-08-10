import { expect, test } from '@playwright/test'
import invariant from 'tiny-invariant'

test.describe('Members page', () => {
  test('should navigate to members', async ({ page }) => {
    await page.goto('/events')
    await page.getByRole('link', { name: 'Jäsenet' }).click()
    await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
    await expect(page.getByText(/^Jäseniä yhteensä: \d+$/)).toBeVisible()
  })

  test('should navigate to member profile', async ({ page }) => {
    await page.goto('/members')
    await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
    const memberNick = await page.getByTestId('member-nick').first()
    const memberName = await page.getByTestId('member-name').first()
    const nickname = await memberNick.textContent()
    const name = await memberName.textContent()

    await expect(nickname).toBeDefined()
    await expect(name).toBeDefined()

    invariant(nickname, 'Fail')
    invariant(name, 'Fail')

    await memberNick.click()

    await expect(
      page.getByRole('heading', { name: 'Jäsenprofiili' })
    ).toBeVisible()

    await expect(page.getByTestId('profile-nick')).toHaveText(nickname)
    await expect(page.getByTestId('profile-name')).toHaveText(name)
    await expect(page.getByTestId('member-created-at')).toHaveText(
      /.*(?:\d{1,2}\.){2}\d{4}$/
    )

    await page.getByTestId('to-members-link').click()

    await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
  })

  test('should use breadcrumbs to navigate', async ({ page }) => {
    await page.goto('/members')
    await expect(page.getByTestId('breadcrumbs-current')).toHaveText('Jäsenet')
    const memberNick = await page.getByTestId('member-nick').first()
    const nickname = await memberNick.textContent()
    await expect(nickname).toBeDefined()
    invariant(nickname, 'Fail')
    await memberNick.click()

    await expect(page.getByTestId('breadcrumbs-current')).toHaveText(nickname)
    const parentPage = page.getByTestId('breadcrumbs-parent')
    await expect(parentPage).toHaveText('Jäsenet')
    await parentPage.click()
    await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
  })
})
