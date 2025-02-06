import { expect, test } from '@playwright/test'
import invariant from 'tiny-invariant'

test.describe('Members page', () => {
  test('should navigate to members', async ({ page }) => {
    await page.goto('/events')
    await page.locator('header').getByRole('link', { name: 'Jäsenet' }).click()
    await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
    await expect(page.getByText(/^Jäseniä yhteensä: \d+$/)).toBeVisible()
  })

  test('should navigate to member profile', async ({ page }) => {
    await test.step('Navigate to members', async () => {
      await page.goto('/members')
    })

    const [nickname, name] = await test.step('Verify member list', async () => {
      await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
      const memberNick = page.getByTestId('member-nick').first()
      const memberName = page.getByTestId('member-name').first()
      const nickname = await memberNick.textContent()
      const name = await memberName.textContent()
      invariant(nickname, 'Fail')
      invariant(name, 'Fail')

      return [nickname, name]
    })

    await test.step('Navigate to member profile', async () => {
      await page.getByRole('link', { name: nickname }).click({ force: true })
      await page.waitForURL(`**/members/${nickname}`)
    })

    await test.step('Verify member profile', async () => {
      await expect(
        page.getByRole('heading', { name: 'Jäsenprofiili' })
      ).toBeVisible()

      await expect(page.getByTestId('profile-nick')).toHaveText(nickname)
      await expect(page.getByTestId('profile-name')).toHaveText(name)
      await expect(page.getByTestId('member-created-at')).toHaveText(
        /.*(?:\d{1,2}\.){2}\d{4}$/
      )
    })

    await test.step('Navigate to members', async () => {
      await page.getByTestId('to-members-link').click()
      await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
    })
  })

  test('should use breadcrumbs to navigate', async ({ page }) => {
    await page.goto('/members')
    await expect(page.getByTestId('breadcrumbs-current')).toHaveText('Jäsenet')
    const memberNick = await page.getByTestId('member-nick').first()
    const nickname = await memberNick.textContent()

    expect(nickname).toBeDefined()
    invariant(nickname, 'Fail')
    await memberNick.click()

    await expect(page.getByTestId('breadcrumbs-current')).toHaveText(nickname)
    const parentPage = page.getByTestId('breadcrumbs-parent')
    await expect(parentPage).toHaveText('Jäsenet')
    await parentPage.click()
    await expect(page.getByRole('heading', { name: 'Jäsenet' })).toBeVisible()
  })
})
