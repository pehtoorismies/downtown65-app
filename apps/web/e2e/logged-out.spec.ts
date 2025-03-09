import { randUser } from '@ngneat/falso'
import { expect, test } from '@playwright/test'
import { format } from 'date-fns'
import { EventPage } from './page-objects/event-page'
import { LoginPage } from './page-objects/login-page'
import { getRandomEventInfo } from './support/random-event'
import { testUser } from './test-user'

test.describe('Logged out users', () => {
  test('should be able to navigate', async ({ page, context }) => {
    await context.clearCookies()

    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()
    await expect(page).toHaveTitle('Dt65 - login')

    await page.getByTestId('to-signup').click()
    await expect(
      page.getByRole('heading', { name: 'Rekisteröidy' }),
    ).toBeVisible()
    await expect(page).toHaveTitle('Dt65 - signup')

    await page.getByTestId('to-login').click()
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()

    await page.getByTestId('to-forgot-password').click()
    await expect(
      page.getByRole('heading', { name: 'Salasana unohtunut' }),
    ).toBeVisible()
    await expect(page).toHaveTitle('Dt65 - forgot password')

    await page.getByTestId('to-login').click()
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()

    await page.getByTestId('button-to-signup').click()
    await expect(
      page.getByRole('heading', { name: 'Rekisteröidy' }),
    ).toBeVisible()

    await page.getByTestId('button-to-login').click()
    await expect(page.getByRole('heading', { name: 'Kirjaudu' })).toBeVisible()
  })

  test('should not be able to login with incorrect credentials', async ({
    context,
    page,
  }) => {
    await context.clearCookies()

    const email = randUser().email
    const login = new LoginPage(page)
    await login.goto()
    await login.submitLogin({
      email,
      password: 'somepassword',
    })
    const error = page.getByRole('alert').getByText('Virhe kirjautumisessa')
    await expect(error).toBeVisible()
  })

  test('should deny access and redirect to login', async ({
    context,
    page,
  }) => {
    await context.clearCookies()
    const login = '**/login'

    await page.goto('/members')
    await page.waitForURL(login)
    await page.goto('/events')
    await page.waitForURL(login)
    await page.goto('/profile')
    await page.waitForURL(login)
    await page.goto('/events/new')
    await page.waitForURL(login)
  })

  test('should show not found', async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/some-page-that-does-not-exist')
    await expect(page.getByRole('heading', { name: 'PUMMI' })).toBeVisible()
    await page.getByTestId('navigate-home').click()
    await page.waitForURL('**/login')
  })

  test('can see event', async ({ page }) => {
    const eventInfo = getRandomEventInfo()

    const eventPage = new EventPage(page)
    await eventPage.create.goto()
    const eventId = await eventPage.wizard.actionCreateEvent(eventInfo)

    await page.getByRole('button', { name: testUser.nick }).click()
    await page.getByRole('menuitem', { name: 'Logout' }).click()
    await expect(page.locator('h1')).toContainText('Kirjaudu')

    await eventPage.view.goto(eventId)

    await expect(eventPage.view.getRace()).toBeHidden()
    await expect(eventPage.view.getTitle()).toContainText(eventInfo.title)
    await expect(eventPage.view.getSubtitle()).toContainText(eventInfo.subtitle)
    await expect(eventPage.view.getLocation()).toContainText(eventInfo.location)
    await eventPage.view.expectParticipantCount(0)

    await expect(
      eventPage.general.getMeta('property', 'og:title'),
    ).toHaveAttribute('content', eventInfo.title)

    const today = format(eventInfo.date, 'd.M.yyyy')
    const startsWithToday = new RegExp(`^${today}`)

    await expect(
      eventPage.general.getMeta('property', 'og:description'),
    ).toHaveAttribute('content', startsWithToday)

    await expect(eventPage.view.getLeaveButton()).toBeHidden()
    await expect(eventPage.view.getParticipateButton()).toBeHidden()
    await expect(eventPage.view.getGotoLoginButton()).toBeVisible()
    await eventPage.view.getGotoLoginButton().click()
    await page.waitForURL('**/login')
  })
})
