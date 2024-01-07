import { EventType } from '@downtown65-app/graphql/graphql'
import {
  randCity,
  randNumber,
  randProductName,
  randSports,
  randUser,
} from '@ngneat/falso'
import { expect, test } from '@playwright/test'
import { format } from 'date-fns'
import { EventPage } from './page-objects/event-page'
import { LoginPage } from './page-objects/login-page'
import { NewEventPage } from './page-objects/new-event-page'
import { testUser } from './test-user'

test.describe('Logged out users', () => {
  test('should be able to navigate', async ({ page, context }) => {
    await context.clearCookies()

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
    const eventTypes = Object.values(EventType)

    const eventBasicInfo = {
      title: randSports(),
      subtitle: randProductName(),
      location: randCity(),
      type: eventTypes[randNumber({ min: 0, max: eventTypes.length - 1 })],
    }

    const newEventPage = new NewEventPage(page)
    await newEventPage.goto()
    const eventId = await newEventPage.actionCreateEvent(eventBasicInfo)

    await page.getByRole('button', { name: testUser.nick }).click()
    await page.getByRole('menuitem', { name: 'Logout' }).click()
    await expect(page.locator('h1')).toContainText('Kirjaudu')

    const eventPage = new EventPage(page, eventId)
    await eventPage.goto()

    await expect(eventPage.getRace()).toBeHidden()
    await expect(eventPage.getTitle()).toContainText(eventBasicInfo.title)
    await expect(eventPage.getSubtitle()).toContainText(eventBasicInfo.subtitle)
    await expect(eventPage.getLocation()).toContainText(eventBasicInfo.location)
    await eventPage.expectParticipantCount(0)

    await expect(eventPage.getMeta('property', 'og:title')).toHaveAttribute(
      'content',
      eventBasicInfo.title
    )

    const today = format(new Date(), 'd.M.yyyy')
    const startsWithToday = new RegExp(`^${today}`)

    await expect(
      eventPage.getMeta('property', 'og:description')
    ).toHaveAttribute('content', startsWithToday)

    await expect(eventPage.getLeaveButton()).toBeHidden()
    await expect(eventPage.getParticipateButton()).toBeHidden()
    await expect(eventPage.getGotoLoginButton()).toBeVisible()
    await eventPage.getGotoLoginButton().click()
    await page.waitForURL('**/login')
  })
})
