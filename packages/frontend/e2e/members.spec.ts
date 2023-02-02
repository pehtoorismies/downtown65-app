import { expect, test } from '@playwright/test'
import invariant from 'tiny-invariant'

test.describe('Members page', () => {
  test('should navigate to members', async ({ page }) => {
    await page.goto('/events')
    await page.getByRole('link', { name: 'Jäsenet' }).click()
    await expect(
      page.getByRole('heading', { name: 'Seuran jäsenet' })
    ).toBeVisible()
    await expect(page.getByText(/^Jäseniä yhteensä: \d+$/)).toBeVisible()
  })

  test('should navigate to member profile', async ({ page }) => {
    await page.goto('/members')
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

    await expect(
      page.getByRole('heading', { name: 'Seuran jäsenet' })
    ).toBeVisible()
  })
})
